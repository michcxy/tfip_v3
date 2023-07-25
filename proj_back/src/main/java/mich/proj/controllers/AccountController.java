package mich.proj.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import jakarta.json.Json;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import mich.proj.models.CartRequest;
import mich.proj.models.Item;
import mich.proj.models.OrderRequest;
import mich.proj.models.PastOrders;
import mich.proj.models.UpdateRatingRequest;
import mich.proj.models.User;
import mich.proj.services.AccountService;

@Controller
@RequestMapping(path="/api")
//@CrossOrigin(origins="*")
public class AccountController {

    @Autowired
    AccountService accSvc;

	@Value("${stripe.secretKey}")
    private String stripeSecretKey;
    
    @PostMapping(path="/createUser", consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
	public ResponseEntity<String> createAccount(@RequestBody User newUser) throws JsonProcessingException {

		System.out.println(newUser);
		System.out.println(newUser.getPlan());
		
		User user = new User();
		user.setFname(newUser.getFname());
        user.setLname(newUser.getLname());
		user.setEmail(newUser.getEmail());
		user.setPassword(newUser.getPassword());
		user.setAddress1(newUser.getAddress1());
		user.setAddress2(newUser.getAddress2());
		user.setPostal(newUser.getPostal());
		user.setPhone(newUser.getPhone());
        user.setGenre(newUser.getGenre());
		user.setPlan(newUser.getPlan());


		try{
			String s = accSvc.createAccount(user);
			System.out.println("string>>>>> " + s);
			return ResponseEntity
            .status(HttpStatus.ACCEPTED)
            .body(null);

		}catch(Exception e) {
            // Return 500 Internal Server Error with error message
            String errorMessage = e.getMessage();
			System.out.println(errorMessage);
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(errorMessage);
		}
    
	}

	@GetMapping(path="/summary/{email}")
	@ResponseBody
	public ResponseEntity<String> userSummary(@PathVariable String email) throws JsonProcessingException{
		System.out.println(email);
		Optional<User> user = accSvc.retrieveAccount(email);
		if(user.get() != null){
		    ObjectMapper objectMapper = new ObjectMapper();
			String userJson = objectMapper.writeValueAsString(user.get());
			System.out.println("summary call" + userJson);
			return ResponseEntity
					.status(HttpStatus.ACCEPTED)
					.body(userJson);
		} else {
			return ResponseEntity
					.status(HttpStatus.NOT_FOUND)
					.body("User not found");
		}
	}

	@GetMapping(path="/checkEmail/{email}")
	@ResponseBody
	public ResponseEntity<Boolean> checkEmailUniqueness(@PathVariable String email) {
		boolean isUnique = accSvc.isEmailUnique(email);
		return ResponseEntity.ok(isUnique);
	}


	@PostMapping("/login")
		@ResponseBody
		public ResponseEntity<Map<String, Object>> login(@RequestParam String email, @RequestParam String password) {
			// Perform validation against MySQL database
			String isValidLogin = accSvc.validateLogin(email, password);

			if ("SUCCESS".equals(isValidLogin)) {
				// Return success response if login is valid
				Map<String, Object> response = new HashMap<>();
				response.put("success", true);
				return ResponseEntity.ok(response);
			} else {
				// Return error response if login is invalid
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
			}
		}

		@PostMapping(path="/editAccount", consumes = MediaType.APPLICATION_JSON_VALUE)
		@ResponseBody
		public ResponseEntity<String> editAccount(@RequestBody User newUser) throws JsonProcessingException {
			
			//System.out.println(newUser);
			Optional<User> userOptional = accSvc.editAccount(newUser);
			if (userOptional.isPresent()) {
				User user = userOptional.get();
				ObjectMapper objectMapper = new ObjectMapper();
				String userJson = objectMapper.writeValueAsString(user);
				System.out.println("editedAccount" + userJson);
				return ResponseEntity
						.status(HttpStatus.ACCEPTED)
						.body(userJson);
			} else {
				return ResponseEntity
						.status(HttpStatus.NOT_FOUND)
						.body("User not found");
			}
			
		}

		@PostMapping(path="/addOrder", consumes = MediaType.APPLICATION_JSON_VALUE)
		@ResponseBody
		public ResponseEntity<User> addOrder(@RequestBody OrderRequest orderRequest) {
        // Extract the necessary data from the order request
        User user = orderRequest.getUser();
        double total = orderRequest.getTotal();
		String plan = orderRequest.getPlan();
        String userId = accSvc.addOrder(user, total, plan);
		System.out.println(userId);
        
        return ResponseEntity
						.status(HttpStatus.ACCEPTED)
						.body(user);
    }

	@PostMapping(path="/addCartOrder", consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
    public void addCartOrder(@RequestBody CartRequest cartRequest) {
		System.out.println("cartitems from request>>>" + cartRequest.getCartItems());
        accSvc.addCartOrder(cartRequest.getCartItems(), cartRequest.getEmail());
    }


	// @GetMapping(path="/history")
	// @ResponseBody
	// public ResponseEntity<List<Item>> getHistory(@RequestParam String email){
	// 	 List<Item> items = accSvc.getAllItems(email);
	// 	return ResponseEntity.ok(items);
	// }

	@GetMapping(path="/history")
	@ResponseBody
	public ResponseEntity<List<PastOrders>> getHistory(@RequestParam String email){
		System.out.println("ENTERING HISTORY CONTROLLER");
		List<PastOrders> pastOrders = accSvc.getAllItems(email);
		//  List<Item> items = accSvc.getAllItems(email);
		System.out.println(pastOrders);
		return ResponseEntity.ok(pastOrders);
	}

	@PostMapping("/create-payment-intent")
	@ResponseBody
		public ResponseEntity<?> createPaymentIntent() {
			System.out.println("calling controller payment");
			// Set your Stripe secret key
			Stripe.apiKey = stripeSecretKey;

			try {
				// Create a PaymentIntent
				PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
						.setAmount(1000L) // Amount in cents (e.g., $10.00) as a Long value
						.setCurrency("usd")
						.build();

				PaymentIntent paymentIntent = PaymentIntent.create(params);

				// Return the client secret to the client
				return ResponseEntity.ok(Json.createObjectBuilder().add("ok", true).add("pi", paymentIntent.getClientSecret()).build().toString());
			} catch (StripeException e) {
				// Handle Stripe API exceptions
				return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating PaymentIntent");
			}
	}

	@PostMapping(path="/updateRating", consumes = MediaType.APPLICATION_JSON_VALUE)
	@ResponseBody
		public ResponseEntity<String> updateRating(@RequestBody UpdateRatingRequest request) {
		System.out.println(request);
		System.out.println(">>>>>>>>>>>> updating rating");
        // Extract the necessary data from the update rating request
		String email = request.getEmail();
       	String itemName = request.getItemName();
        int rating = request.getRating();

		System.out.println(" EMAIL >>>>" + email);
		System.out.println(" item >>>>" + itemName);
		System.out.println(" rating >>>>" + rating);
        accSvc.updateRating(email, itemName, rating);
        
        return ResponseEntity
						.status(HttpStatus.ACCEPTED)
						.body(null);
    }

	@GetMapping(path="/getAlbums")
	@ResponseBody
	public ResponseEntity<List<Item>> getAlbumsByArtist(@RequestParam String artistName) {
        System.out.println("TRYING TO GET ALBUMS >>>>" + artistName);
        List<Item> items = accSvc.getAlbumsByArtist(artistName);
        System.out.println(items);
        return ResponseEntity.ok(items);
    }


}

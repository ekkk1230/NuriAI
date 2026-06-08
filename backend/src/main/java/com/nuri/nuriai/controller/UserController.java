package com.nuri.nuriai.controller;

import com.nuri.nuriai.dto.UserDto;
import com.nuri.nuriai.security.JwtTokenProvider;
import com.nuri.nuriai.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/join")
    public UserDto.UserResponse joinUser(@RequestBody UserDto.UserRequest request) {
        return userService.joinUser(request);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody java.util.Map<String, String> map) {
        String inputId = map.get("userId");
        String userPwd = map.get("userPwd");

        UserDto.UserResponse userDto = userService.loginUser(inputId, userPwd);

        String token = jwtTokenProvider.createToken(String.valueOf(userDto.getId()));

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("user", userDto);
        response.put("accessToken", token);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{type}/{value}")
    public boolean confirmValue(@PathVariable("type") String type, @PathVariable("value") String value) {
        return userService.confirmValue(type, value);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        String userId = principal.getName();
        UserDto.UserResponse userDto = userService.getCurrentUser(userId);

        return ResponseEntity.ok(userDto);
    }
}

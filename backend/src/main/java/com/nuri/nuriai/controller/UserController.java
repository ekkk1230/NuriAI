package com.nuri.nuriai.controller;

import com.nuri.nuriai.domain.User;
import com.nuri.nuriai.dto.UserDto;
import com.nuri.nuriai.security.JwtTokenProvider;
import com.nuri.nuriai.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    public ResponseEntity<UserDto.LoginResponse> loginUser(@RequestBody UserDto.LoginRequest request) {

        UserDto.UserResponse userDto = userService.loginUser(request);
        String token = jwtTokenProvider.createToken(userDto.getUserId());

        return ResponseEntity.ok(new UserDto.LoginResponse(userDto, token));
    }

    @GetMapping("/{type}/{value}")
    public boolean confirmValue(@PathVariable("type") String type, @PathVariable("value") String value) {
        return userService.confirmValue(type, value);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Principal principal) {
        String userId = principal.getName();
        System.out.println(userId);
        UserDto.UserResponse userDto = userService.getCurrentUser(userId);

        return ResponseEntity.ok(userDto);
    }

    @DeleteMapping("/withdraw")
    public ResponseEntity<Void> withdrawUser(@AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        userService.withdrawUser(user);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/find")
    public ResponseEntity<UserDto.FindResponse> findUserId(
            @RequestParam("findType") String findType,
            @RequestBody UserDto.FindRequest request
    ) {
        if ("id".equals(findType)) {
            return ResponseEntity.ok(userService.findUserId(request.getEmail()));
        } else {
            return ResponseEntity.ok(userService.findUserPwd(request.getUserId(), request.getEmail()));
        }
    }
}

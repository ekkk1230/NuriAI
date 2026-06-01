package com.nuri.nuriai.controller;

import com.nuri.nuriai.dto.UserDto;
import com.nuri.nuriai.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/join")
    public UserDto.UserResponse joinUser(@RequestBody UserDto.UserRequest request) {
        return userService.joinUser(request);
    }

    @PostMapping("/login")
    public UserDto.UserResponse loginUser(@RequestBody java.util.Map<String, String> map) {
        String userId = map.get("userId");
        String userPwd = map.get("userPwd");

        System.out.println("🔥 Map으로 가로챈 ID: " + userId);
        System.out.println("🔥 Map으로 가로챈 PWD: " + userPwd);

        return userService.loginUser(userId, userPwd);
    }

    @GetMapping("/{type}/{value}")
    public boolean confirmValue(@PathVariable("type") String type, @PathVariable("value") String value) {
        return userService.confirmValue(type, value);
    }
}

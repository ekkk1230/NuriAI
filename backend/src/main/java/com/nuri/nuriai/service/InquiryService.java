package com.nuri.nuriai.service;

import com.nuri.nuriai.domain.Inquiry;
import com.nuri.nuriai.domain.User;
import com.nuri.nuriai.dto.InquiryDto;
import com.nuri.nuriai.repository.InquiryRepository;
import com.nuri.nuriai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InquiryService {
    private final InquiryRepository inquiryRepository;
    private final UserRepository userRepository;

    public List<InquiryDto.Response> getInquiriesByUserId(String userId) {
        return inquiryRepository.findByUserUserId(userId).stream()
                .map(InquiryDto.Response::new)
                .toList();
    }

    @Transactional
    public InquiryDto.Response insertInquiry(String userId, InquiryDto.Request request) {
        User user = userRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원정보 입니다."));

        Inquiry newInquiry = Inquiry.builder()
                .title(request.getTitle())
                .inquiryContent(request.getInquiryContent())
                .user(user)
                .build();

        inquiryRepository.save(newInquiry);
        return new InquiryDto.Response(newInquiry);
    }
}

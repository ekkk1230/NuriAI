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
        User user = userRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원정보입니다."));

        Inquiry newInquiry = Inquiry.builder()
                .title(request.getTitle())
                .inquiryContent(request.getInquiryContent())
                .user(user)
                .build();

        inquiryRepository.save(newInquiry);
        return new InquiryDto.Response(newInquiry);
    }

    @Transactional
    public InquiryDto.Response updateInquiry(String userId, Long inquiryId, InquiryDto.Request request) {
        User user = userRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원정보입니다"));
        Inquiry inquiry = inquiryRepository.findById(inquiryId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 문의글입니다."));

//        System.out.println("조회한 회원정보: " + inquiry.getUser().getUserId());
//        System.out.println("찾은 회원정보: " + user.getUserId());

        if (!inquiry.getUser().getUserId().equals(user.getUserId())) {
            throw new IllegalArgumentException("회원정보가 일치하지 않습니다.");
        }
        inquiry.update(request.getTitle(), request.getInquiryContent());

        return new InquiryDto.Response(inquiry);
    }

    @Transactional
    public void deleteInquiry(String userId, Long inquiryId) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 게시글 입니다."));

        if (!inquiry.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인이 작성한 문의글만 삭제할 수 있습니다.");
        }

        inquiryRepository.delete(inquiry);
    }
}

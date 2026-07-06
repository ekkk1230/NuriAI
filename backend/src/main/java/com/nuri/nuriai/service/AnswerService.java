package com.nuri.nuriai.service;

import com.nuri.nuriai.domain.Answer;
import com.nuri.nuriai.domain.Inquiry;
import com.nuri.nuriai.domain.InquiryStatus;
import com.nuri.nuriai.dto.InquiryDto;
import com.nuri.nuriai.repository.AnswerRepository;
import com.nuri.nuriai.repository.InquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnswerService {
    private final AnswerRepository answerRepository;
    private final InquiryRepository inquiryRepository;


    @Transactional
    public InquiryDto.AnswerResponse insertAnswer(Long inquiryId, InquiryDto.AnswerRequest request) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 문의글입니다."));

        Answer answer = Answer.builder()
                .answerContent(request.getAnswerContent())
                .inquiry(inquiry)
                .build();

        answerRepository.save(answer);
        inquiry.updateStatus(InquiryStatus.ANSWERED);

        return InquiryDto.AnswerResponse.builder()
                .answerContent(answer.getAnswerContent())
                .createdAt(answer.getCreatedAt())
                .build();
    }

    @Transactional
    public InquiryDto.AnswerResponse updateAnswer(Long inquiryId, InquiryDto.AnswerRequest request) {
        Inquiry inquiry = inquiryRepository.findById(inquiryId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 문의글입니다."));

        Answer answer = inquiry.getAnswer();
        if (answer == null) {
            throw new IllegalStateException("수정할 답변이 존재하지 않습니다.");
        }

        answer.update(request.getAnswerContent());
        return new InquiryDto.AnswerResponse(answer.getInquiry());
    }

    @Transactional
    public void deleteAnswer(Long inquiryId) {
        inquiryRepository.deleteById(inquiryId);
    }
}

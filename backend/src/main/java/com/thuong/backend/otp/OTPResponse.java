package com.thuong.backend.otp;

import lombok.Data;

@Data
public class OTPResponse {
    private String status;
    private String code;
    private String message;
    private String otp;
}

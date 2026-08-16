package com.nntan041299.bakeryservice.file;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.UncheckedIOException;

public final class MultipartFileUtils {

    private MultipartFileUtils() {
    }

    public static File toTempFile(MultipartFile file) {
        try {
            File tempFile = File.createTempFile("upload-", extensionOf(file.getOriginalFilename()));
            file.transferTo(tempFile);
            return tempFile;
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to read uploaded file", e);
        }
    }

    private static String extensionOf(String filename) {
        if (filename == null) {
            return "";
        }
        int dotIndex = filename.lastIndexOf('.');
        if (dotIndex < 0) {
            return "";
        }
        return filename.substring(dotIndex).replaceAll("[^a-zA-Z0-9.]", "");
    }
}

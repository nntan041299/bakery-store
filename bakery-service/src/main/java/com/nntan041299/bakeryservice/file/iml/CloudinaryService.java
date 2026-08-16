package com.nntan041299.bakeryservice.file.iml;

import com.cloudinary.Cloudinary;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nntan041299.bakeryservice.file.FileUploadingResponse;
import com.nntan041299.bakeryservice.file.FileUploadingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Component
@Qualifier("cloudinaryService")
public class CloudinaryService implements FileUploadingService {

  private final Cloudinary cloudinary;
  private final ObjectMapper objectMapper;

  public CloudinaryService(@Value("${cloudinary.url}") String cloudinaryUrl, ObjectMapper objectMapper) {
    this.cloudinary = new Cloudinary(cloudinaryUrl);
    this.cloudinary.config.secure = true;
    this.objectMapper = objectMapper;
  }

  @Override
  public Optional<FileUploadingResponse> upload(File file) {
    Objects.requireNonNull(file, "File is null when uploading to Cloudinary");

    try {
      Map<?, ?> response = cloudinary.uploader().upload(file, getConfig());
      return Optional.of(objectMapper.convertValue(response, CloudinaryResponse.class));
    } catch (IOException e) {
      log.error("Exception happened while uploading to Cloudinary", e);
      return Optional.empty();
    } finally {
      if (!file.delete()) {
        log.warn("Failed to delete the file: {}", file.getAbsolutePath());
      }
    }
  }

  private Map<?, ?> getConfig() {
    CloudinaryRequest request =
        CloudinaryRequest.builder()
            .isFileNameUsed(true)
            .isFileNameUnique(false)
            .isOverwrite(true)
            .build();
    return objectMapper.convertValue(request, Map.class);
  }
}

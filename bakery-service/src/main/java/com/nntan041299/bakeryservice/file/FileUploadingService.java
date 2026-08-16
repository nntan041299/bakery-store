package com.nntan041299.bakeryservice.file;

import java.io.File;
import java.util.Optional;

public interface FileUploadingService {

  Optional<FileUploadingResponse> upload(File file);
}

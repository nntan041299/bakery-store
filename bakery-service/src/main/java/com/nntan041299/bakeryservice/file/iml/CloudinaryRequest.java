package com.nntan041299.bakeryservice.file.iml;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CloudinaryRequest {

  @JsonProperty("use_filename")
  private boolean isFileNameUsed;

  @JsonProperty("unique_filename")
  private boolean isFileNameUnique;

  @JsonProperty("overwrite")
  private boolean isOverwrite;
}

package com.nntan041299.bakeryservice.file.iml;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.nntan041299.bakeryservice.file.FileUploadingResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Date;

@EqualsAndHashCode(callSuper = false)
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CloudinaryResponse extends FileUploadingResponse {

  @JsonProperty("signature")
  private String signature;

  @JsonProperty("format")
  private String format;

  @JsonProperty("resource_type")
  private String resourceType;

  @JsonProperty("secure_url")
  private String secureUrl;

  @JsonProperty("created_at")
  private Date createdAt;

  @JsonProperty("asset_id")
  private String assetId;

  @JsonProperty("version_id")
  private String versionId;

  @JsonProperty("type")
  private String type;

  @JsonProperty("version")
  private int version;

  @JsonProperty("url")
  private String url;

  @JsonProperty("public_id")
  private String publicId;

  @JsonProperty("tags")
  private ArrayList<String> tags;

  @JsonProperty("folder")
  private String folder;

  @JsonProperty("original_filename")
  private String originalFilename;

  @JsonProperty("api_key")
  private String apiKey;

  @JsonProperty("bytes")
  private int bytes;

  @JsonProperty("overwritten")
  private boolean overwritten;

  @JsonProperty("width")
  private int width;

  @JsonProperty("etag")
  private String etag;

  @JsonProperty("placeholder")
  private boolean placeholder;

  @JsonProperty("height")
  private int height;

  @Override
  public String getUrl() {
    return secureUrl != null ? secureUrl : url;
  }
}

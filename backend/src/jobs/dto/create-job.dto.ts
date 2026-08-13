import { IsArray, ArrayMinSize, IsUrl } from "class-validator";

export class CreateJobDto {
  @IsArray({ message: "urls must be an array of strings" })
  @ArrayMinSize(1, { message: "urls array must contain at least 1 URL" })
  @IsUrl(
    {
      protocols: ["http", "https"],
      require_protocol: true,
    },
    {
      each: true,
      message: "Each URL must be a valid http:// or https:// URL",
    },
  )
  urls!: string[];
}

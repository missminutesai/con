import {
  interactions,
  message,
} from "https://deno.land/x/discordinteractions/mod.ts";
import { serve } from "https://deno.land/std/http/server.ts";

const client = interactions({
  publicKey: "ac3acab3ea76033d6405e67e63312d5ccfb5f725ba00ccdaf81e97e9535c6ede",
})
  .slash(
    "test",
    (i) => message({ content: `Hello ${i.member?.user.username}!` }),
  );

serve(client.handle);

import { redirect } from "next/navigation";

// The root just sends users to the right place
export default function Home() {
  redirect("/dashboard");
}

import { MoveLeftIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Notfound from "@/public/not-found.svg";

const NotFound = () => {
  return (
    <div className="w-full h-full flex items-center justify-center mx-auto">
      <div className="flex-col items-center justify-center text-center w-full gap-4">
        <Image
          src={Notfound}
          height={100}
          width={100}
          alt="Not found"
          className="w-4/6 sm:w-3/6 md:w-2/6 h-auto flex items-center justify-center mx-auto"
        />

        <p className="mt-5 px-2">
          may be the page you&apos;re looking for is not found or never existed.
        </p>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 hover:text-muted-foreground mt-5"
        >
          <MoveLeftIcon /> Go to Dashboard
        </Link>
      </div>
    </div>
  );
};
export default NotFound;

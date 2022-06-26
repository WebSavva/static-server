import Link from "next/link";
import { useRouter } from "next/router";
import { FaFileUpload, FaFolder } from "react-icons/fa";

export default function NavigationLink() {
  const { pathname } = useRouter();

  const isOnUploadPage = pathname === "/upload";

  const Icon = isOnUploadPage ? FaFolder : FaFileUpload;
  const href = isOnUploadPage ? "/folders" : "/upload";

  return (
    <Link href={href}>
      <a className="d-flex justify-content-end d-block fs-5 mb-2">
        <Icon className="text-primary" />
      </a>
    </Link>
  );
}

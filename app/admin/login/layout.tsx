import { LOGIN_BG } from "@/lib/constants/images";
import Image from "next/image";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex w-screen min-h-screen'>
      {children}
      <Image
        width={200}
        height={300}
        className='w-1/2 h-screen object-cover hidden md:block'
        src={LOGIN_BG.src}
        alt=''
      />
    </div>
  );
}

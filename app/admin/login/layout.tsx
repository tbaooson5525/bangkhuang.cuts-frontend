import { LOGIN_BG } from "@/lib/constants/images";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex w-screen min-h-screen'>
      {children}
      <img
        className='w-1/2 h-screen object-cover hidden md:block'
        src={LOGIN_BG.src}
        alt=''
      />
    </div>
  );
}

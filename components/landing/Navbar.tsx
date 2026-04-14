import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className='pt-12 flex justify-between'>
      {/* Logo */}
      <Link href='/' className='cursor-pointer'>
        <Image
          width={300}
          height={300}
          className='h-auto w-[30%] object-cover'
          src='/images/sidebar_logo.png'
          alt='bangkhuang.cuts logo'
        />
      </Link>

      {/* Navigation */}
      <nav className='flex'>
        <ul className=''>
          <li>
            <Link href='/about'>About</Link>
          </li>
          <li>
            <Link href='/location'>Location</Link>
          </li>
          <li>
            <Link href='/services'>Services</Link>
          </li>
          <li>
            <Link href='/services'>Barbers</Link>
          </li>
        </ul>
      </nav>

      {/* Booking Button */}
      <div>
        <Link href='/booking'>Booking</Link>
      </div>
    </header>
  );
}

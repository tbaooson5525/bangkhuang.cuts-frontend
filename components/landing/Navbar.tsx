export default function Navbar() {
  return (
    <header className='pt-12 flex justify-between'>
      {/* Logo */}
      <a href='/' className='cursor-pointer'>
        <img
          className='h-auto w-[30%] object-cover'
          src='/images/sidebar_logo.png'
          alt='bangkhuang.cuts logo'
        />
      </a>

      {/* Navigation */}
      <nav className='flex'>
        <ul className=''>
          <li>
            <a href='/about'>About</a>
          </li>
          <li>
            <a href='/location'>Location</a>
          </li>
          <li>
            <a href='/services'>Services</a>
          </li>
          <li>
            <a href='/services'>Barbers</a>
          </li>
        </ul>
      </nav>

      {/* Booking Button */}
      <div>
        <a href='/booking'>Booking</a>
      </div>
    </header>
  );
}

"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const NavbarUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toogleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar bg-transparent justify-between pt-5">
      <div className="cursor-pointer text-xl pl-2">EventHive</div>
      <div className="flex gap-6">
        <p className="text-lg">Events</p>
        {/* <p className="text-sm">Points: POINTS</p> */}
        <div ref={dropdownRef} className="relative">
          <img
            src="https://placehold.co/40x40"
            alt="photoprofile"
            className="rounded-full"
            onClick={toogleDropdown}
          />
          {dropdownOpen && (
            <div className="absolute z-50 my-2 right-2 top-10 rounded-lg bg-primary-content">
              <div className="w-40">
                <Link href="/profile">
                  <p className="block px-4 py-2 hover:bg-gray-100">Profile</p>
                </Link>
                <a className="block px-4 py-2 hover:bg-gray-100">Logout</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarUser;

{
  /* <nav className="flex justify-between px-4 py-4 items-center">
      <div className="cursor-pointer">EventHive</div>
      <div className="flex gap-6 items-center">
        <p>Events</p>
        <div className="rounded-full">
          <img
            src="https://placehold.co/40x40"
            alt="photoprofile"
            className="rounded-full"
          />
        </div>
      </div>
    </nav> */
}

import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import { Disclosure } from '@headlessui/react';
import Image from 'next/image';
import logo from '../images/logo.png';
import Cookies from 'js-cookie';
import router from "next/router";

const navigation = [
    { name: 'Number Memory', href: '/dashboard' },
    { name: 'Audio Memory', href: '/game/audioMemory' }
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
    const pathname = usePathname();
    const handleLogout = () => {
        Cookies.remove("isLoggedIn");
        router.push("/");
    };
    return (
        <Disclosure as="nav" className="bg-white shadow-lg">
            {({ }) => (
                <>
                    <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-1">
                        <div className="flex h-20 justify-between">
                            <div className="flex">
                                <div className="flex flex-shrink-0 items-center">
                                    <Image
                                        src={logo}
                                        width={70}
                                        height={70}
                                        alt="logo"
                                    />

                                </div>
                                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                                    {navigation.map((item) => (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className={classNames(
                                                pathname === item.href
                                                    ? 'border-slate-500 text-gray-900'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                                                'inline-flex items-center px-1 pt-1 border-b-2 text-lg font-medium'
                                            )}
                                            aria-current={pathname === item.href ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </a>
                                    ))}
                                </div>
                            </div>
                            <button
                            onClick={handleLogout}
                            className="absolute right-0 px-4 py-2 my-6 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                        >
                            LOGOUT
                        </button>
                        </div>
                        
                    </div>
                </>
            )}
        </Disclosure>
    );
}
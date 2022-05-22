import { BsFillCaretRightFill } from 'react-icons/bs';
import { GiPositionMarker } from 'react-icons/gi';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { IoMdMail } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { AiFillFacebook } from 'react-icons/ai';


type Props = {}

const Footer = (props: Props) => {

    const links = [
        {
            href: '/',
            label: 'Trang chủ',
        },

    ]

    return (
        <div className='relative bottom-0 left-0 grid grid-cols-1 sm:grid-cols-2 xl:px-32 xl:gap-16 lg:grid-cols-4 lg:pt-10 2xl:px-72 bg-[#232323] text-sm gap-8 px-8 pt-4 pb-48 mt-56 lg:pb-[448px]'>
            <div>
                <h1 className='text-white mb-4 text-xl font-semibold'>Giới thiệu</h1>
                <p className='text-[#9f9f9f] text-justify'>Rewind là dự án về đề tài giới thiệu nhà hàng ăn uống. Đề tài được đưa ra bởi công ty Sun*, lên ý tưởng và thực hiện bởi Nguyễn Anh Vương</p>
            </div>
            <div className='flex flex-col'>
                <h1 className='text-white mb-4 text-xl font-semibold'>Liên kết</h1>
                {
                    links.map((link, index) => (
                        <Link className='text-[#9f9f9f] mb-3 flex items-center' to={link.href} key={index}>
                            <BsFillCaretRightFill size={"16px"} />
                            <span className='pl-6'>{link.label}</span>
                        </Link>
                    ))
                }
            </div>

            <div>
                <h1 className='text-white mb-4 text-xl font-semibold'>Thông tin liên hệ</h1>
                <p className='text-[#9f9f9f] text-justify flex items-center mb-4'>
                    <GiPositionMarker className="text-[28px] sm:text-2xl lg:text-5xl" />
                    <span className='pl-4 block'>
                        số 11 ngõ 207 đương Phương Trạch, xã Vĩnh Ngọc, huyện Đông Anh, tỉnh Hà Nội
                    </span>
                </p>
                <p className='text-[#9f9f9f] text-justify flex items-center mb-4'>
                    <BsFillTelephoneFill className="text-lg" />
                    <span className='pl-4'>
                        0333944588
                    </span>
                </p>
                <p className='text-[#9f9f9f] text-justify flex items-center mb-4'>
                    <IoMdMail className="text-lg" />
                    <span className='pl-4'>
                        navuong2001@gmail.com
                    </span>
                </p>
            </div>
            <div>
                <h1 className='text-white mb-4 text-xl font-semibold'>Fanpage</h1>
                <a target='blank' className='relative block h-32 bg-cover bg-no-repeat max-w-[280px] bg-[url("https://scontent.fhan14-2.fna.fbcdn.net/v/t39.30808-6/240604538_4453955581306903_5278316769641249471_n.png?_nc_cat=111&ccb=1-7&_nc_sid=e3f864&_nc_ohc=k-vDNXE6IzcAX-M0lIX&_nc_ht=scontent.fhan14-2.fna&oh=00_AT-rUEXZVP09dKts0YDm-ONISO1tulOUEGXfEv-pKfdC0w&oe=628D0AC9")]' href='https://www.facebook.com/SunAsteriskVietnam'>
                    <div className='flex bg-gradient-to-b from-[#000000b3] to-transparent p-2'>
                        <div className='w-14 h-14 border-2 border-white'>
                            <img className='object-cover' src="https://scontent.fhan14-2.fna.fbcdn.net/v/t1.6435-9/54520883_2139775916058226_5605834457685688320_n.png?_nc_cat=100&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=_2ZUUjHWNfMAX-aGeyG&_nc_ht=scontent.fhan14-2.fna&oh=00_AT92RtPYiM1Bx-u9T2sZXXMmNNW2_Qcm2E1a0Y-zl0Hp7w&oe=62AFDF7D" alt="" />
                        </div>
                        <div className='flex flex-col ml-2'>
                            <span className='text-white text-xl font-semibold text-shadow'>Sun*</span>
                            <span className='text-white text-sm text-shadow'>78K likes</span>
                        </div>
                    </div>
                    <div className='absolute bottom-2 left-2 p-1 flex bg-[#ebedf0] border border-[#0000001f] items-center w-24 h-6'>
                        <AiFillFacebook size={16} className="text-[#3a5897]" />
                        <span className='text-black font-[550] text-sm ml-1'>Like Page</span>
                    </div>
                </a>
            </div>

        </div>
    )
}

export default Footer
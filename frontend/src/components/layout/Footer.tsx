import { BsFillCaretRightFill } from 'react-icons/bs';
import { GiPositionMarker } from 'react-icons/gi';
import { BsFillTelephoneFill } from 'react-icons/bs';
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
      <div className='relative bottom-0 left-0 grid grid-cols-1 sm:grid-cols-2 xl:px-32 xl:gap-16 lg:grid-cols-12 lg:pt-10 2xl:px-72 bg-[#232323] text-sm gap-8 px-8 pt-4 pb-48 mt-56 lg:pb-[448px]'>
        <div className='col-span-3'>
          <h1 className='text-white mb-4 text-xl font-semibold'>Giới thiệu</h1>
          <p className='text-[#9f9f9f] text-justify'>
            Rewind là dự án về đề tài giới thiệu nhà hàng ăn uống.
          </p>
        </div>
        <div className='flex flex-col col-span-2'>
          <h1 className='text-white mb-4 text-xl font-semibold'>Liên kết</h1>
          {links.map((link, index) => (
            <Link
              className='text-[#9f9f9f] mb-3 flex items-center'
              to={link.href}
              key={index}
            >
              <BsFillCaretRightFill size={'16px'} />
              <span className='pl-1'>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className='col-span-3'>
          <h1 className='text-white mb-4 text-xl font-semibold'>
            Thông tin liên hệ
          </h1>
          <p className='text-[#9f9f9f] text-justify flex items-center mb-4'>
            <GiPositionMarker className='text-3xl sm:text-2xl lg:text-3xl' />
            <span className='pl-3 block'>
              Số 1, Đại Cồ Việt, Hai Bà Trưng, Hà Nội
            </span>
          </p>
          <p className='text-[#9f9f9f] text-justify flex items-center mb-4'>
            <BsFillTelephoneFill className='text-lg ml-1' />
            <span className='pl-4'>0243 623 1732</span>
          </p>
        </div>
        <div className='col-span-4 w-full'>
          <h1 className='text-white mb-4 text-xl font-semibold'>Fanpage</h1>
          <a
            target='blank'
            className='relative block h-32 bg-cover bg-center bg-no-repeat max-w-[280px] bg-[url("https://scontent-ssn1-1.xx.fbcdn.net/v/t39.30808-6/324891044_5701804629927219_7962743852452445327_n.jpg?stp=dst-jpg_p600x600&_nc_cat=107&ccb=1-7&_nc_sid=e3f864&_nc_ohc=1zMbXSeCvT0AX8maO7r&_nc_ht=scontent-ssn1-1.xx&oh=00_AfDMvPaiiM7JEWjtAOFujdLa0c_ABcsmXrhL1YmYsH4xBg&oe=63E062B5")]'
            href='https://www.facebook.com/dhbkhanoi'
          >
            <div className='flex bg-gradient-to-b from-[#000000b3] to-transparent p-2'>
              <div className='w-14 h-14 border-2 border-white'>
                <img
                  className='object-cover'
                  src='https://scontent.fhan15-2.fna.fbcdn.net/v/t31.18172-8/21122550_930977190373638_6448461248229799488_o.jpg?_nc_cat=50&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=wIzQ1FZYG7wAX_QOGER&_nc_ht=scontent.fhan15-2.fna&oh=00_AfD6X5sDB7YTJ0QCQdI3LHIiNSlfLvqhHkn3oeOsf0Ns7g&oe=63FC3E7E'
                  alt='hust'
                />
              </div>
              <div className='flex flex-col ml-2'>
                <span className='text-white text-xl font-semibold text-shadow'>
                  HUST
                </span>
                <span className='text-white text-sm text-shadow'>
                  289k likes
                </span>
              </div>
            </div>
            <div className='absolute bottom-2 left-2 p-1 flex bg-[#ebedf0] border border-[#0000001f] items-center w-24 h-6'>
              <AiFillFacebook size={16} className='text-[#3a5897]' />
              <span className='text-black font-[550] text-sm ml-1'>
                Like Page
              </span>
            </div>
          </a>
        </div>
      </div>
    );
}

export default Footer
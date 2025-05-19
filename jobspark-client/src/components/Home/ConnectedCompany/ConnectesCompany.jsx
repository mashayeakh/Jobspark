import React from 'react'
// import { Marquee } from 'react-fast-marquee';
import Marquee from "react-fast-marquee";
import Google from '../../../assets/imgs/companyLogo/google.png'
import Amazon from '../../../assets/imgs/companyLogo/amazon.png'
import Microsoft from '../../../assets/imgs/companyLogo/microsoft.jpeg'
import Meta from '../../../assets/imgs/companyLogo/meta.png'
import Netflix from '../../../assets/imgs/companyLogo/Netflix.png'
import Apple from '../../../assets/imgs/companyLogo/apple.png'
import Tesla from '../../../assets/imgs/companyLogo/tesla.png'
import Adobe from '../../../assets/imgs/companyLogo/adobe.png'
import Uber from '../../../assets/imgs/companyLogo/uber.png'
import Airbnb from '../../../assets/imgs/companyLogo/airbnb.png'



const ConnectesCompany = () => {


    const companies = [
        { name: 'Google', logo: Google },
        { name: 'Amazon', logo: Amazon },
        { name: 'Microsoft', logo: Microsoft },
        { name: 'Meta', logo: Meta },
        { name: 'Netflix', logo: Netflix },
        { name: 'Apple', logo: Apple },
        { name: 'Tesla', logo: Tesla },
        { name: 'Adobe', logo: Adobe },
        { name: 'Uber', logo: Uber },
        { name: 'Airbnb', logo: Airbnb },
    ];


    return (
        <>

            <div className="flex flex-col items-center justify-center py-10 shadow-lg">
                <p className="text-center text-6xl text-shadow-orange-50 text-[#404b5b] ">
                    Helping people secure better jobs—faster—since 2007.
                </p>
                <p className="text-black text-center py-7 text-3xl max-w-6xl leading-snug break-words">
                    We have helped millions of JobLeaders worldwide to find more relevant jobs, get more interview <span className='font-bold'>invitations,</span> and receive <span className='font-bold'>multiple offers
                    </span>
                </p>
                <div className='lg:py-20'>
                    <p className='text-4xl text-center pb-15'>Companies Hiring Through Us</p>
                    <Marquee speed={50} pauseOnHover={true} gradient={false} className="w-full">
                        <div className="flex justify-between items-center w-full lg:gap-[80px]">
                            {companies.map((company, index) => (
                                <div key={index} className="flex justify-center items-center w-1/12">
                                    <img
                                        src={company.logo}
                                        alt={`${company.name} logo`}
                                        className="w-20 object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </Marquee>

                </div>
            </div>
        </>
    )
}

export default ConnectesCompany
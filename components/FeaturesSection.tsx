import React from 'react'
import { motion } from 'framer-motion';
import {fadeIn} from "~/lib/variants";
import TripCard from "./TripCard";

const FeaturesSection = () => {
    return (
        <section className="py-12 bg-white sm:py-16 lg:py-20">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="text-center">
                    <motion.h2
                        variants={fadeIn('up', 0.2) as any}
                        initial='hidden'
                        whileInView={'show'}
                        viewport={{once: false, amount: 0.2}}
                        className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl xl:text-5xl font-pj"
                    >
                        Explore Our Popular Trips
                    </motion.h2>
                    <motion.p
                        variants={fadeIn('up', 0.4) as any}
                        initial='hidden'
                        whileInView={'show'}
                        viewport={{once: false, amount: 0.4}}
                        className="mt-4 text-base leading-7 text-gray-600 sm:mt-8 font-pj">
                        Discover amazing destinations and create unforgettable memories with our curated travel packages.
                    </motion.p>
                </div>

                <div
                    className="grid grid-cols-1 gap-6 px-8 mt-12 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 sm:px-0"
                >
                    <motion.div
                        variants={fadeIn('up', 0.6) as any}
                        initial='hidden'
                        whileInView={'show'}
                        viewport={{once: false, amount: 0.2}}
                    >
                        <TripCard
                            id={'1'}
                            name={'Paris'}
                            location={'France'}
                            imageUrl={'/assets/images/card-img-1.png'}
                            price={'$234'}
                            tags={['Adventure', 'Culture']}
                        />
                    </motion.div>
                    <motion.div
                        variants={fadeIn('up', 0.8) as any}
                        initial='hidden' 
                        whileInView={'show'}
                        viewport={{once: false, amount: 0.2}}
                    >
                        <TripCard
                            id={'2'}
                            name={'Rome'}
                            location={'Italy'}
                            imageUrl={'/assets/images/card-img-2.png'}
                            price={'$543'}
                            tags={['Adventure', 'Culture']}
                        />
                    </motion.div>
                    <motion.div
                        variants={fadeIn('up', 1) as any}
                        initial='hidden'
                        whileInView={'show'}
                        viewport={{once: false, amount: 0.2}}
                    >
                        <TripCard
                            id={'3'}
                            name={'London'}
                            location={'UK'}
                            imageUrl={'/assets/images/card-img-3.png'}
                            price={'$345'}
                            tags={['Adventure', 'Culture']}
                        />
                    </motion.div>
                    <motion.div
                        variants={fadeIn('up', 1.2)as any}
                        initial='hidden'
                        whileInView={'show'}
                        viewport={{once: false, amount: 0.2}}
                    >
                        <TripCard
                            id={'4'}
                            name={'New York'}
                            location={'USA'}
                            imageUrl={'/assets/images/card-img-4.png'}
                            price={'$765'}
                            tags={['Adventure', 'Culture']}
                        />
                    </motion.div>
                    <motion.div
                        variants={fadeIn('up', 1.4) as any}
                        initial='hidden'
                        whileInView={'show'}
                        viewport={{once: false, amount: 0.2}}
                    >
                        <TripCard
                            id={'5'}
                            name={'Tokyo'}
                            location={'Japan'}
                            imageUrl={'/assets/images/card-img-5.png'}
                            price={'$456'}
                            tags={['Adventure', 'Culture']}
                        />
                    </motion.div>
                    <motion.div
                        variants={fadeIn('up', 1.6) as any}
                        initial='hidden'
                        whileInView={'show'}
                        viewport={{once: false, amount: 0.2}}
                    >
                        <TripCard
                            id={'6'}
                            name={'Sydney'}
                            location={'Australia'}
                            imageUrl={'/assets/images/card-img-6.png'}
                            price={'$678'}
                            tags={['Adventure', 'Culture']}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
export default FeaturesSection

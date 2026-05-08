// import React from 'react';
// import { CheckCircle, Users, DollarSign, Send, Briefcase, Target, Clock, Zap } from 'lucide-react';

// const TwoColumnFeature = () => {
//   const jobSeekerFeatures = [
//     {
//       icon: CheckCircle,
//       text: "Connect directly with founders at top startups - no third party recruiters allowed."
//     },
//     {
//       icon: DollarSign,
//       text: "Everything you need to know, all upfront. View salary, stock options, and more before applying."
//     },
//     {
//       icon: Send,
//       text: "Say goodbye to cover letters - your profile is all you need. One click to apply and you're done."
//     },
//     {
//       icon: Target,
//       text: "Unique jobs at startups and tech companies you can't find anywhere else."
//     }
//   ];

//   const recruiterFeatures = [
//     {
//       icon: Users,
//       text: "Tap into a community of 10M+ engaged, startup-ready candidates."
//     },
//     {
//       icon: Briefcase,
//       text: "Everything you need to kickstart your recruiting - set up job posts, company branding, and HR tools within 10 minutes, all for free."
//     },
//     {
//       icon: Clock,
//       text: "A free applicant tracking system, or free integration with any ATS you may already use."
//     },
//     {
//       icon: Zap,
//       text: "Let us handle the heavy-lifting with RecruiterCloud. Our new AI-Recruiter scans 500M+ candidates, filters it down based on your unique calibration, and schedules your favorites on your calendar in a matter of days."
//     }
//   ];

//   return (
//     <div className="bg-white py-16 px-4">
//       <div className="max-w-7xl mx-auto">
//         <div className="grid md:grid-cols-2 gap-12">
//           {/* Left Column - Job Seekers */}
//           <div className="space-y-8">
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold text-gray-900">Got talent?</h2>
//               <h3 className="text-4xl font-bold text-gray-900">Why job seekers love us</h3>
//             </div>
            
//             <div className="space-y-6">
//               {jobSeekerFeatures.map((feature, index) => {
//                 const Icon = feature.icon;
//                 return (
//                   <div key={index} className="flex items-start space-x-4">
//                     <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
//                       <Icon className="w-6 h-6 text-pink-600" />
//                     </div>
//                     <p className="text-gray-700 leading-relaxed">{feature.text}</p>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="flex space-x-4 pt-4">
//               <button className="px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors">
//                 Learn more
//               </button>
//               <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
//                 Sign up
//               </button>
//             </div>
//           </div>

//           {/* Right Column - Recruiters */}
//           <div className="space-y-8">
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold text-gray-900">Need talent?</h2>
//               <h3 className="text-4xl font-bold text-gray-900">Why recruiters love us</h3>
//             </div>
            
//             <div className="space-y-6">
//               {recruiterFeatures.map((feature, index) => {
//                 const Icon = feature.icon;
//                 return (
//                   <div key={index} className="flex items-start space-x-4">
//                     <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
//                       <Icon className="w-6 h-6 text-pink-600" />
//                     </div>
//                     <p className="text-gray-700 leading-relaxed">{feature.text}</p>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="flex space-x-4 pt-4">
//               <button className="px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors">
//                 Learn more
//               </button>
//               <button className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
//                 Sign up
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TwoColumnFeature;

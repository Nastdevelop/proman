import { Users, Briefcase, Handshake } from "lucide-react";

export default function Home() {
  
  const features = [
    { title: "Personal Projects", desc: "Manage your personal projects in a private workspace that is accessible only to you.", icon: Users },
    { title: "Team Projects", desc: "Lead your team as a project manager by organizing tasks, assigning responsibilities, and tracking progress in one place.", icon: Briefcase },
    { title: "Freelance Project", desc: "Increase your value as a freelancer by giving clients access to track project progress in real time.", icon: Handshake },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white ">
      {/* Hero Section */}
        <div className="flex shadow-xl w-full h-[50vh] md:h-screen bg-[linear-gradient(to_top,#09090b,transparent),url('/bgd.png')] bg-cover bg-center bg-no-repeat flex-col items-start justify-end px-4 md:pl-10 ">
          <h1 className="text-4xl md:text-7xl font-bold text-start">
            WELCOME TO 
          <span className="text-blue-500 text-4xl md:text-7xl font-bold text-start block md:inline"> PROMAN</span>
          </h1>
          <p className="mt-4 max-w-2xl px-3 md:pl-3 text-sm md:text-lg text-zinc-300 mb-10">
          A list-based project management platform that helps individuals and teams organize tasks, set priorities, and deliver projects on time.
        </p>
      </div>

      {/* About Section */}
      <div className="max-w-6xl mt-10 mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-3">About</h2>
        <p className="w-full max-w-[700px] px-4 text-center mx-auto mb-10">Proman offers three types of project management solutions to Personal, Team, and Collaboration. designed to meet different workflows and productivity needs.</p>
        
        {/* CARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, index) => (
            <div 
              key={index} 
              className="group border border-zinc-800 bg-zinc-900 p-6 rounded-2xl transition-all duration-300 hover:border-blue-500 hover:bg-zinc-800 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
            >
              <div className="mb-4 text-blue-500 transition-colors duration-300 group-hover:text-blue-400">
                <item.icon size={40} />
              </div>
              <h1 className="text-xl font-semibold mb-2">{item.title}</h1>
              <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <footer className="border-t border-zinc-800 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} Proman. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-zinc-500 text-sm">
            Built with <span className="text-blue-400">Next.js</span> &amp; <span className="text-blue-400">Tailwind CSS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
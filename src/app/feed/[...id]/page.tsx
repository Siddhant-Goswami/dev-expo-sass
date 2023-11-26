/* eslint-disable @next/next/no-img-element */
import Footer from '@/components/ui/footer';
import NavBar from '@/components/ui/navbar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import GetInTouchModal from '@/components/ui/get-in-touch-modal';

function Page() {
  const projectTitle = '3D Cube Network for UX/Ul Design';
  const availableForWork = true;
  const userName = 'Rishabh Gurbani';

  const lol = `Communicative Agents for Software Development

  


  【English   | Chinese | Japanese | Korean | Filipino | French | Slovak | Portuguese | Spanish | Dutch | Hindi| Bahasa Indonesia】


  【📚 Wiki | 🚀 Local Demo | 👥 Community Built Software | 🔧 Customization | 👾 Discord】

📖 Overview

ChatDev stands as a virtual software company that operates through various intelligent agents holding
different roles, including Chief Executive Officer , Chief Product Officer , Chief Technology Officer , programmer , reviewer , tester , art designer . These
agents form a multi-agent organizational structure and are united by a mission to "revolutionize the digital world
through programming." The agents within ChatDev collaborate by participating in specialized functional seminars,
including tasks such as designing, coding, testing, and documenting.
The primary objective of ChatDev is to offer an easy-to-use, highly customizable and extendable framework,
which is based on large language models (LLMs) and serves as an ideal scenario for studying collective intelligence.




🎉 News


November 15th, 2023: We launched ChatDev as a SaaS platform that enables software developers and innovative entrepreneurs to build software efficiently at a very low cost and barrier to entry. Try it out at https://chatdev.modelbest.cn/.





November 2nd, 2023: ChatDev is now supported with a new feature: incremental development, which allows agents to develop upon existing codes. Try --config "incremental" --path "[source_code_directory_path]" to start it.





October 26th, 2023: ChatDev is now supported with Docker for safe execution (thanks to contribution from ManindraDeMel). Please see Docker Start Guide.






September 25th, 2023: The Git mode is now available, enabling the programmer  to utilize Git for version control. To enable this feature, simply set "git_management" to "True" in ChatChainConfig.json. See guide.




September 20th, 2023: The Human-Agent-Interaction mode is now available! You can get involved with the ChatDev team by playing the role of reviewer  and making suggestions to the programmer ;
try python3 run.py --task [description_of_your_idea] --config "Human". See guide and example.




September 1st, 2023: The Art mode is available now! You can activate the designer agent  to generate images used in the software;
try python3 run.py --task [description_of_your_idea] --config "Art". See guide and example.
August 28th, 2023: The system is publicly available.
August 17th, 2023: The v1.0.0 version was ready for release.
July 30th, 2023: Users can customize ChatChain, Phase, and Role settings. Additionally, both online Log mode and replay
mode are now supported.
July 16th, 2023: The preprint paper associated with this project was published.
June 30th, 2023: The initial version of the ChatDev repository was released.

❓ What Can ChatDev Do?



  
  

  demo.mp4
  







⚡️ Quickstart
💻️ Quickstart with Web
Access the web page for visualization and configuration use: https://chatdev.modelbest.cn/
🖥️ Quickstart with terminal
To get started, follow these steps:


Clone the GitHub Repository: Begin by cloning the repository using the command:
<code>git clone https://github.com/OpenBMB/ChatDev.git
</code>


Set Up Python Environment: Ensure you have a version 3.9 or higher Python environment. You can create and
activate this environment using the following commands, replacing ChatDev_conda_env with your preferred environment
name:
<code>conda create -n ChatDev_conda_env python=3.9 -y
conda activate ChatDev_conda_env
</code>
`;

  return (
    <>
      <NavBar />
      <section className="mt-8 flex justify-center">
        <main className="flex w-8/12 flex-col justify-center">
          <h1 className="mb-4 w-full text-left text-2xl font-semibold">
            {projectTitle}
          </h1>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src="https://cdn.dribbble.com/users/7041299/avatars/normal/data?1613186743"
                  alt="User Avatar"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <div className="mb-0.5 text-sm font-semibold">{userName}</div>
                <div className="flex items-center">
                  <div
                    className={
                      'h-2 w-2 ' +
                      (availableForWork ? 'bg-green-500' : 'bg-red-500') +
                      ' mr-2 rounded-full'
                    }
                  ></div>
                  {availableForWork ? (
                    <span className="text-xs text-green-500">
                      Available for work
                    </span>
                  ) : (
                    <span className="text-xs text-red-500">
                      Not available for work
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="icon">
                Like
              </Button>

              <GetInTouchModal
                username={userName}
                text="Get in Touch"
                roundedFull={false}
              />
            </div>
          </div>
          <div className="h-500 w-900 overflow-hidden rounded-sm">
            <img
              className="h-full w-full object-cover"
              src="https://cdn.dribbble.com/userupload/11597547/file/original-0bc15864f71e1fcdfa8152b2379fdb44.jpg"
              alt="3D Cube Network"
            />
          </div>

          <div className="mt-8">
            {lol.split('\n').map((line, index) => (
              <p key={index} className="my-2 text-base">
                {line}
              </p>
            ))}
          </div>

          <div className="mt-6 flex w-full flex-col items-center justify-center border-t border-gray-500 py-8">
            <h3 className="text-xl font-medium"> Liked {userName}'s work?? </h3>
            <p className="mb-4 mt-2 text-sm">
              Get in touch with {userName} to discuss your project.
            </p>
            <GetInTouchModal username="Rishabh" text="Get in Touch" />
          </div>
        </main>
      </section>
      <Footer />
    </>
  );
}

export default Page;

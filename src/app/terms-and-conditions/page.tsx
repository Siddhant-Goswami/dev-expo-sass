import Footer from '@/components/ui/footer';
import NavBar from '@/components/ui/navbar';

export default function Page() {
  return (
    <>
      <NavBar />
      <main className="flex w-full flex-col justify-center bg-[#f5f5f4] dark:bg-[#020817]">
        <section className="mx-auto my-12 flex max-w-4xl flex-col justify-center rounded-2xl bg-white px-8 pb-20 pt-4 dark:bg-slate-800">
          <h1 className="py-10 text-center text-5xl font-bold">
            Terms & Conditions
          </h1>
          <p className="text-xl font-medium">1. Using the website</p>
          <br></br>
          <p>
            ‍By using our Website, you are deemed to have accepted the following
            terms and conditions. If you do not want to be legally bound by
            these terms and conditions, please do not access or use the Website.
            We reserve the right to change these terms and conditions at any
            time and you are advised to review these terms regularly to ensure
            you are aware of any changes. Your continued use of the Website
            after such changes are posted will be deemed agreement on your part
            to these terms and conditions as amended.
          </p>
          <br></br>
          <br></br>
          <p className="text-xl font-medium">2. Intellectual property</p>
          <br></br>
          <p>
            ‍2.1 Copyright and all intellectual property rights in the content
            of the website are vested in Codible Ventures LLP and reserved,
            unless indicated otherwise. The content of the Website belongs to
            Codible Ventures LLP unless indicated otherwise. You may use the
            content of the Website subject to the following conditions:
          </p>
          <p>(a) It is used for information purposes only</p>
          <p>(b) It is used only for your own personal, non-commercial use</p>
          <p>
            (c)Any copies or downloads of any content from the Website must
            include a notice that copyright in the relevant material is owned by
            Codible Ventures LLP.
          </p>
          <br></br>
          <p>
            2.2 Except as expressly provided above, nothing contained on this
            Website should be construed as conferring any licence or right to
            use any trademark or copyright of Codible Ventures LLP&#39; or any
            third party.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}

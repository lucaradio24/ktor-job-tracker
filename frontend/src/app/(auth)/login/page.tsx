import { auth0 } from "@/lib/auth0";
import Image from "next/image";
import { redirect } from "next/navigation";
import style from "./login.module.css";

export default async function LoginPage() {
  const session = await auth0.getSession();

  if (session) {
    redirect("/");
  }

  return (
    <main className={style.loginPage}>
      <section className={style.loginShell}>
        <header className={style.brand}>
          <Image
            src="/jobtracker-logo.png"
            alt=""
            width={44}
            height={44}
            loading="eager"
          />
          <span>JOBTRACKER</span>
        </header>

        <div className={style.layout}>
          <section className={style.card} aria-labelledby="login-title">
            <h1 id="login-title" className={style.title}>
              La ricerca,
              <br />
              finalmente <span>in ordine.</span>
            </h1>

            <div className={style.divider} />

            <div className={style.auth}>
              <h2>Accedi a JobTracker</h2>
              <p className={style.description}>
                Continua con il tuo account per gestire le tue candidature.
              </p>

              <div className={style.providers}>
                <a
                  className={`${style.provider} ${style.googleProvider}`}
                  href="/auth/login?connection=google-oauth2"
                >
                  <span className={style.googleMark} aria-hidden="true">
                    G
                  </span>
                  Continua con Google
                </a>

                <a
                  className={`${style.provider} ${style.githubProvider}`}
                  href="/auth/login?connection=github"
                >
                  <span className={style.providerMark} aria-hidden="true">
                    GH
                  </span>
                  Continua con GitHub
                </a>
              </div>

              <p className={style.legal}>
                Accedendo confermi di aver letto termini e informativa sulla
                privacy.
              </p>
            </div>
          </section>

          <div className={style.mascot} aria-hidden="true">
            <Image
              className={style.mascotImage}
              src="/robot-login-wav.png"
              alt=""
              width={1024}
              height={1536}
              loading="eager"
              sizes="(max-width: 60rem) 18rem, 30rem"
            />
          </div>
        </div>
      </section>
    </main>
  );
}

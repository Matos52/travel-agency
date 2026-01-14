import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { Link } from "react-router";
import.meta.env.VITE_BACKEND_URL;

const signIn = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSignIn = async () => {
    window.location.href = `${backendUrl}/oauth2/authorization/google`;
  };

  return (
    <main className="auth">
      <section className="size-full glassmorphism flex-center px-6">
        <div className="sign-in-card">
          <header className="header">
            <Link to="/home">
              <img
                src="/assets/icons/Matriply.png"
                alt="logo"
                className="rounded-xl"
              />
            </Link>
          </header>
          <article>
            <h2 className="p-28-semibold text-dark-100 text-center">
              Start Your Travel Journey
            </h2>
            <p className="p-18-regular text-center text-gray-100 !leading-7">
              Sign in with Google to manage destinations, itineraries, and user
              activity with ease.
            </p>
          </article>

          <ButtonComponent
            type="button"
            iconCss="e-search-icon"
            className="button-class !h-11 !w-full"
            onClick={handleSignIn}
          >
            <img
              src="/assets/icons/google.svg"
              alt="google"
              className="size-5"
            />
            <span className="p-18-semibold text-white">
              Sign in with Google
            </span>
          </ButtonComponent>
        </div>
      </section>
    </main>
  );
};

export default signIn;

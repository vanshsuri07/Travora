import {Link, redirect} from "react-router";
import {loginWithGoogle} from "~/appwrite/auth";
import {account} from "~/appwrite/client";

export async function clientLoader() {
    try {
      const user = await account.get();
      if (user.$id) return redirect('/dashboard');
    } catch (e) {
        // User not logged in, continue to sign-in page
        console.log("No active session");
    }
    return null;
}

const SignIn = () => {
    return (
        <main className="auth">
            <section className="size-full glassmorphism flex-center px-6">
                <div className="sign-in-card">
                    <header className="header">
                        <Link to="/">
                            <img
                                src="/assets/icons/logo.svg"
                                alt="logo"
                                className="size-[30px]"
                            />
                        </Link>
                        <h1 className="p-28-bold text-dark-100">Tourvisto</h1>
                    </header>

                    <article>
                        <h2 className="p-28-semibold text-dark-100 text-center">Start Your Travel Journey</h2>
                        <p className="p-18-regular text-center text-gray-100 !leading-7">Sign in with Google to manage destinations, itineraries, and user activity with ease.</p>
                    </article>

                    <button
                        type="button"
                        className="button-class !h-11 !w-full flex items-center justify-center gap-3 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                        onClick={loginWithGoogle}
                    >
                        <img
                            src="/assets/icons/google.svg"
                            className="size-5"
                            alt="google"
                        />
                        <span className="p-18-semibold text-white">Sign in with Google</span>
                    </button>
                </div>
            </section>
        </main>
    )
}

export default SignIn
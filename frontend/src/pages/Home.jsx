import { Link } from "react-router-dom";

function Home({ user }) {
  // send the user to the right place when the button is clicked
  let buttonLink = "/login";
  if (user && user.role === "donor") buttonLink = "/donor";
  if (user && user.role === "ngo") buttonLink = "/ngo";

  return (
    <div>
      <section className="hero">
        <h1>Share Food, Spread Hope</h1>
        <p>
          Food Bridge connects restaurants, stores and people who have extra food with NGOs that
          can give it to those in need. Together we can reduce food waste.
        </p>
        <Link to={buttonLink} className="btn btn-white">
          {user ? "Go to Dashboard" : "Get Started"}
        </Link>
      </section>

      <section className="container">
        <h2 className="section-title">How it works</h2>

        <div className="feature-grid">
          <div className="card feature">
            <div className="feature-icon">🍽️</div>
            <h3>1. Donors post food</h3>
            <p>Restaurants, stores or individuals add the food they want to donate with pickup details.</p>
          </div>

          <div className="card feature">
            <div className="feature-icon">🔍</div>
            <h3>2. NGOs browse</h3>
            <p>NGOs can see all the available food and search by name or location.</p>
          </div>

          <div className="card feature">
            <div className="feature-icon">🤝</div>
            <h3>3. Accept and deliver</h3>
            <p>An NGO accepts the donation, picks it up and gives it to the people who need it.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

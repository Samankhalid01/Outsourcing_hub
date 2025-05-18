import React from 'react';
import '../styles/pages/LandingPage.css'; // Link the CSS file for styling

const LandingPage = () => {
  // Dynamic feature list
  const features = [
    {
      title: 'Efficient Job Listings',
      description: 'Easily explore jobs tailored to your skills.',
      icon: '📋',
    },
    {
      title: 'Developer Dashboard',
      description: 'Manage your projects, bids, and timelines seamlessly.',
      icon: '📊',
    },
    {
      title: 'Secure Payments',
      description: 'Get paid securely and on time for your hard work.',
      icon: '💳',
    },
  ];

  return (
    <div className="landing-page">

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Outsourcing Hub</h1>
          <p>
            Streamline your job outsourcing process with our centralized platform. 
            Post jobs, find opportunities, and collaborate with ease.
          </p>
          <a href="/register" className="cta-button">Get Started</a>
        </div>
      </header>

      {/* Features Section */}
      <main className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features">
          {features.map((feature, index) => (
            <div key={index} className="feature">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Testimonial Section */}
      <section className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials">
          <div className="testimonial">
            <p>"Outsourcing Hub has transformed the way I find projects. The platform is seamless and efficient!"</p>
            <h4>- Hassan Riaz, Developer</h4>
          </div>
          <div className="testimonial">
            <p>"A game-changer for job outsourcing! Payments are secure and collaborations are smooth."</p>
            <h4>- Akram, Freelancer</h4>
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join our community of developers and start collaborating today.</p>
        <a href="/register" className="cta-button">Sign Up Now</a>
      </section>


    </div>
  );
};

export default LandingPage;

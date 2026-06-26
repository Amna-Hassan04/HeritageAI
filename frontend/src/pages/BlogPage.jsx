import React from 'react';
import SubmitArticlePage from './SubmitArticlePage';
const BlogPage = () => {
  const blogPosts = [
    {
      id: 1,
      title: "The Ancient Indus Valley: Uncovering Mohenjo-daro's Secrets",
      excerpt: "Explore how AI is helping archaeologists decode the mysteries of one of the world's oldest civilizations through artifact analysis.",
      category: "Heritage & Culture",
      date: "February 5, 2026",
      author: "Dr. Ayesha Khan",
      image: "https://i.pinimg.com/736x/42/64/b7/4264b758fdd20e6fc6d25a4d364d07eb.jpg?w=800&q=80",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "How AI Identifies Artifacts: Behind the Technology",
      excerpt: "A deep dive into the computer vision and machine learning techniques that power HeritageAI's artifact identification system.",
      category: "AI & Technology",
      date: "February 1, 2026",
      author: "Tech Team",
      image: "https://i.pinimg.com/736x/46/65/f3/4665f394c55c18370b4c8b365fcdcb5f.jpg?w=800&q=80",
      readTime: "7 min read"
    },
    {
      id: 3,
      title: "Digital Guardians: Preserving Endangered Sites with AI",
      excerpt: "Discover how predictive modeling and 3D mapping are safeguarding at-risk heritage sites from the effects of climate change and urban decay.",
      category: "Preservation",
      date: "February 8, 2026",
      author: "Omar Farooq",
      image: "https://i.pinimg.com/1200x/34/ca/79/34ca7965aed17883093b9a4bbccf6260.jpg?w=800&q=80",
      readTime: "6 min read"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">HeritageAI Blog</h1>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          Exploring the intersection of technology and South Asian heritage through stories, insights, and discoveries
        </p>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                  {post.category}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.date}</span>
                  <button className="text-amber-600 font-medium hover:text-amber-700 transition-colors">
                    Read More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Write for Us Section
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-lg p-8 border-2 border-amber-200">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Interested in Writing for Us?</h2>
            <p className="text-lg text-gray-700 mb-6">
              We're always looking for passionate writers, historians, archaeologists, and heritage enthusiasts to share their knowledge and stories with our community.
            </p>
            
            <div className="bg-white rounded-lg p-6 mb-6 text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-4">We're looking for articles about:</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700"><strong>South Asian Heritage:</strong> Historical sites, artifacts, cultural traditions, and archaeological discoveries</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700"><strong>AI & Technology:</strong> How technology is transforming heritage preservation and cultural education</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700"><strong>Personal Stories:</strong> Your experiences with artifacts, family heirlooms, or cultural heritage discoveries</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                href="submit-article" 
                className="bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors inline-block"
              >
                Submit Your Article
              </button>
              <a 
                href="/contact" 
                className="bg-white text-amber-600 border-2 border-amber-600 px-8 py-3 rounded-lg font-medium hover:bg-amber-50 transition-colors inline-block"
              >
                Learn More
              </a>
            </div>
          </div>
        </div> 

        {/* Newsletter Signup */}
       {/* <div className="bg-white rounded-xl shadow-lg p-8 mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Stay Updated</h2>
          <p className="text-gray-700 mb-6 text-center max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest insights on AI, heritage preservation, and cultural discoveries from across South Asia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
            <button className="bg-amber-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div> */} 
      </div> 
    </div>
  );
};

export default BlogPage;
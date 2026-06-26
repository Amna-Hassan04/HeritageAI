// src/pages/SubmitArticlePage.jsx
import { useState } from "react";
import MdEditor from '@uiw/react-md-editor';
// ✅ THIS IS A DEFAULT EXPORT
export default function SubmitArticlePage({ setCurrentPage }) {
  const [formData, setFormData] = useState({
    authorName: '',
    email: '',
    articleTitle: '',
    category: '',
    content: '',
    bio: '',
    file: null
  });

  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'Heritage & Culture',
    'AI & Technology',
    'User Stories',
    'Educational',
    'Thought Leadership',
    'Archaeological Discoveries',
    'Personal Heritage Journey'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Article submitted:', formData);
    setSubmitted(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleContentChange = (value) => {
    setFormData({
      ...formData,
      content: value || ''
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files ? e.target.files[0] : null
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-xl shadow-lg p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-green-600">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Submitted Successfully!</h1>
            <p className="text-lg text-gray-700 mb-6">
              Thank you for contributing to HeritageAI! Our team will review your submission and get back to you within 3-5 business days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/blog"
                className="bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors inline-block"
              >
                Read Our Blog
              </a>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-white text-amber-600 border-2 border-amber-600 px-8 py-3 rounded-lg font-medium hover:bg-amber-50 transition-colors cursor-pointer"
              >
                Submit Another Article
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Submit Your Article</h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl mx-auto">
          Share your knowledge, stories, and insights about South Asian heritage, AI technology, or cultural preservation with our community.
        </p>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-lg p-8 mb-8 border-2 border-amber-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Submission Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">We're Looking For:</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Original, well-researched content</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">800-2000 word articles</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Engaging, accessible writing style</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Relevant images (if available)</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Article Topics:</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">South Asian heritage sites & artifacts</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">AI in cultural preservation</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Personal heritage discoveries</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">Archaeological insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Author Information</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="authorName"
                    name="authorName"
                    value={formData.authorName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Short Bio (50-100 words)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself - your background, expertise, or interest in heritage preservation..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent resize-none"
                ></textarea>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Details</h2>

              <div className="mb-6">
                <label htmlFor="articleTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Article Title *
                </label>
                <input
                  type="text"
                  id="articleTitle"
                  name="articleTitle"
                  value={formData.articleTitle}
                  onChange={handleChange}
                  placeholder="Enter a compelling title for your article"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                  Article Content *
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Write or paste your article here (800-2000 words recommended). Use the toolbar to add bold, italics, links, and more.
                </p>
                <div data-color-mode="light" className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-amber-600 focus-within:border-transparent">
                  <MdEditor
                    value={formData.content}
                    onChange={handleContentChange}
                    height={400}
                    preview="edit"
                    className="w-full"
                    textareaProps={{
                      placeholder: "Start writing your article here...",
                      id: "content"
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Word count: {formData.content.split(' ').filter(word => word.length > 0).length}
                </p>
              </div>

              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Images (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                  <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                  />
                  <label htmlFor="file" className="cursor-pointer">
                    <div className="text-4xl mb-2">📎</div>
                    <p className="text-gray-600 mb-1">
                      {formData.file ? formData.file.name : 'Click to upload images or document'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, PDF, DOC (Max 10MB)
                    </p>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-lg p-6 border-2 border-amber-200">
              <h3 className="font-semibold text-gray-900 mb-3">Before You Submit:</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Your article should be original content not published elsewhere</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Please proofread for grammar and spelling</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>Include proper citations for any referenced sources</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <p>We'll contact you within 3-5 business days about your submission</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                type="submit"
                className="bg-amber-600 text-white px-10 py-4 rounded-lg font-medium hover:bg-amber-700 transition-colors shadow-lg hover:shadow-xl text-lg cursor-pointer"
              >
                Submit Article
              </button>
              <a
                href="/blog"
                className="bg-white text-amber-600 border-2 border-amber-600 px-10 py-4 rounded-lg font-medium hover:bg-amber-50 transition-colors text-center text-lg inline-flex items-center justify-center cursor-pointer"
              >
                Cancel
              </a>
            </div>
          </form>
        </div>

        
      </div>
    </div>
  );
}

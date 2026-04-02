import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BlogList from './pages/Blog/index';
import BlogPost from './pages/Blog/Post';
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/DashboardLayout';
import AdminResume from './pages/admin/AdminResume';
import EditorBlog from './pages/admin/EditorBlog';
import ManageReviews from './pages/admin/ManageReviews';
import SiteSettings from './pages/admin/SiteSettings';
import { useAuthStore } from './lib/store';

function App() {
  const init = useAuthStore((s) => s.init);

  // Subscribe to Supabase auth state once on mount
  useEffect(() => {
    const unsubscribe = init();
    return unsubscribe;
  }, [init]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />

        {/* Admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminResume />} />
          <Route path="reviews" element={<ManageReviews />} />
          <Route path="blog" element={<EditorBlog />} />
          <Route path="settings" element={<SiteSettings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

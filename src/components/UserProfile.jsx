import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Briefcase, Save, Edit2, X, Calendar, FileText, Phone, Globe, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function UserProfile({ userProfile, onUpdateProfile }) {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: userProfile?.location || '',
    title: userProfile?.title || '',
    dob: userProfile?.dob || '',
    occupation: userProfile?.occupation || '',
    phone: userProfile?.phone || '',
    website: userProfile?.website || '',
    interests: userProfile?.interests || '',
    bio: userProfile?.bio || ''
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: user?.name || prev.name,
      email: user?.email || prev.email
    }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const bgClass = isDark ? 'from-slate-800 to-slate-900 border-slate-700' : 'from-white to-slate-50 border-slate-200';
  const textClass = isDark ? 'text-white' : 'text-slate-900';
  const labelClass = isDark ? 'text-slate-300' : 'text-slate-700';
  const inputBgClass = isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500';
  const focusClass = isDark ? 'focus:border-indigo-400' : 'focus:border-indigo-500';
  const iconClass = isDark ? 'text-indigo-400' : 'text-indigo-600';

  if (isEditing) {
    return (
      <div className={`bg-gradient-to-br ${bgClass} rounded-lg p-8 border`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${textClass} flex items-center gap-2`}>
            <User size={28} className={iconClass} />
            Edit Profile
          </h2>
          <button
            onClick={() => setIsEditing(false)}
            className={`p-2 hover:bg-opacity-50 rounded-lg transition ${isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}
          >
            <X size={20} className={isDark ? 'text-slate-400' : 'text-slate-600'} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${labelClass} mb-2`}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${inputBgClass} focus:outline-none ${focusClass}`}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${labelClass} mb-2`}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled
              className={`w-full px-4 py-2 border rounded-lg ${inputBgClass} focus:outline-none ${focusClass} opacity-75 cursor-not-allowed`}
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${labelClass} mb-2`}>Location</label>
            <div className="flex items-center relative">
              <MapPin size={18} className={`absolute ml-3 ${iconClass}`} />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${inputBgClass} focus:outline-none ${focusClass}`}
                placeholder="City, Country"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${labelClass} mb-2`}>Title</label>
            <div className="flex items-center relative">
              <Briefcase size={18} className={`absolute ml-3 ${iconClass}`} />
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${inputBgClass} focus:outline-none ${focusClass}`}
                placeholder="Your title"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${labelClass} mb-2`}>Date of Birth</label>
            <div className="flex items-center relative">
              <Calendar size={18} className={`absolute ml-3 ${iconClass}`} />
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${inputBgClass} focus:outline-none ${focusClass}`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${labelClass} mb-2`}>Occupation</label>
            <div className="flex items-center relative">
              <FileText size={18} className={`absolute ml-3 ${iconClass}`} />
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${inputBgClass} focus:outline-none ${focusClass}`}
                placeholder="Your occupation"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${labelClass} mb-2`}>Phone Number</label>
            <div className="flex items-center relative">
              <Phone size={18} className={`absolute ml-3 ${iconClass}`} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${inputBgClass} focus:outline-none ${focusClass}`}
                placeholder="+1 (123) 456-7890"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${labelClass} mb-2`}>Website/Portfolio</label>
            <div className="flex items-center relative">
              <Globe size={18} className={`absolute ml-3 ${iconClass}`} />
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${inputBgClass} focus:outline-none ${focusClass}`}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${labelClass} mb-2`}>Interests/Hobbies</label>
            <div className="flex items-center relative">
              <Sparkles size={18} className={`absolute ml-3 ${iconClass}`} />
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${inputBgClass} focus:outline-none ${focusClass}`}
                placeholder="e.g., Reading, Coding, Photography"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${labelClass} mb-2`}>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg ${inputBgClass} focus:outline-none ${focusClass}`}
              placeholder="Tell us about yourself"
              rows="4"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              onClick={handleSave}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition ${
                isDark
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white'
              }`}
            >
              <Save size={18} />
              Save Changes
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className={`flex-1 py-2 rounded-lg font-semibold transition ${
                isDark
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-slate-300 hover:bg-slate-400 text-slate-900'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br ${bgClass} rounded-lg p-8 border`}>
      <div className="flex items-center justify-between mb-8">
        <h2 className={`text-2xl font-bold ${textClass} flex items-center gap-2`}>
          <User size={28} className={iconClass} />
          Profile
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
            isDark
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-indigo-500 hover:bg-indigo-600 text-white'
          }`}
        >
          <Edit2 size={18} />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-white/50'}`}>
          <p className={`text-xs uppercase tracking-wide font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Name
          </p>
          <p className={`text-xl font-bold ${textClass} mt-1`}>{formData.name}</p>
        </div>

        <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-white/50'}`}>
          <p className={`text-xs uppercase tracking-wide font-semibold flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            <Mail size={14} />
            Email
          </p>
          <p className={`text-lg font-semibold ${textClass} mt-1 break-all`}>{formData.email}</p>
        </div>

        {formData.title && (
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-white/50'}`}>
            <p className={`text-xs uppercase tracking-wide font-semibold flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <Briefcase size={14} />
              Title
            </p>
            <p className={`text-lg font-semibold ${textClass} mt-1`}>{formData.title}</p>
          </div>
        )}

        {formData.dob && (
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-white/50'}`}>
            <p className={`text-xs uppercase tracking-wide font-semibold flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <Calendar size={14} />
              Date of Birth
            </p>
            <p className={`text-lg font-semibold ${textClass} mt-1`}>{new Date(formData.dob).toLocaleDateString()}</p>
          </div>
        )}

        {formData.occupation && (
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-white/50'}`}>
            <p className={`text-xs uppercase tracking-wide font-semibold flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <FileText size={14} />
              Occupation
            </p>
            <p className={`text-lg font-semibold ${textClass} mt-1`}>{formData.occupation}</p>
          </div>
        )}

        {formData.location && (
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-white/50'}`}>
            <p className={`text-xs uppercase tracking-wide font-semibold flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <MapPin size={14} />
              Location
            </p>
            <p className={`text-lg font-semibold ${textClass} mt-1`}>{formData.location}</p>
          </div>
        )}

        {formData.phone && (
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-white/50'}`}>
            <p className={`text-xs uppercase tracking-wide font-semibold flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <Phone size={14} />
              Phone
            </p>
            <p className={`text-lg font-semibold ${textClass} mt-1`}>{formData.phone}</p>
          </div>
        )}

        {formData.website && (
          <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-white/50'}`}>
            <p className={`text-xs uppercase tracking-wide font-semibold flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              <Globe size={14} />
              Website
            </p>
            <a href={formData.website} target="_blank" rel="noopener noreferrer" className={`text-lg font-semibold ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} mt-1 break-all`}>
              Visit Website
            </a>
          </div>
        )}
      </div>

      {formData.interests && (
        <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-white/50'}`}>
          <p className={`text-xs uppercase tracking-wide font-semibold flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
            <Sparkles size={14} />
            Interests
          </p>
          <p className={`${textClass}`}>{formData.interests}</p>
        </div>
      )}

      {formData.bio && (
        <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-white/50'}`}>
          <p className={`text-xs uppercase tracking-wide font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
            Bio
          </p>
          <p className={`${textClass}`}>{formData.bio}</p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthFormWrapper from '../../../components/AuthFormWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaSyncAlt } from 'react-icons/fa';

interface LoginFormData {
  email: string;
  password: string;
  captchaInput: string;
  remberMe?: boolean;
}

interface ErrorObject {
  email?: string;
  password?: string;
  captcha?: string;
}

const generateCaptcha = () => Math.random().toString(36).substring(2, 8);

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    captchaInput: ''
  });
  const [errors, setErrors] = useState<ErrorObject>({});
  const [sisaKesempatan, setSisaKesempatan] = useState<number>(3);

  const [captchaText, setCaptchaText] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);


  if (typeof window !== 'undefined' && !captchaText) {
    setCaptchaText(generateCaptcha());
  }

  const handleRefreshCaptcha = () => {
    setCaptchaText(generateCaptcha());
    setFormData(prev => ({ ...prev, captchaInput: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sisaKesempatan <= 0) return;

    const newErrors: ErrorObject = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email tidak boleh kosong';
    } else if (!/^[0-9]+@gmail\.com$/.test(formData.email)) {
      newErrors.email = 'Email harus sesuai dengan npm kalian (contoh : 2920@gmail.com)';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password tidak boleh kosong';
    } else if (!/^[0-9]+$/.test(formData.password)) {
      newErrors.password = 'Password harus sesuai dengan npm kalian (contoh : 241712920)';
    }

    if (!formData.captchaInput.trim()) {
      newErrors.captcha = 'Captcha belum diisi';
    } else if (formData.captchaInput !== captchaText) {
      newErrors.captcha = 'Captcha tidak valid';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const newSisa = sisaKesempatan - 1;
      setSisaKesempatan(newSisa);
      if (newSisa > 0) {
        toast.error(`Login Gagal! Sisa kesempatan: ${newSisa}`, { theme: 'dark', position: 'top-right' });
      } else {
        toast.error('Kesempatan login habis!', { theme: 'dark', position: 'top-right' });
      }
      return;
    }

 
    localStorage.setItem('isLoggedIn', 'true');
    toast.success('Login Berhasil!', { theme: 'dark', position: 'top-right' });
    router.push('/home');
  };

  return (
    <AuthFormWrapper title="Login">
      <form onSubmit={handleSubmit} className="space-y-5 w-full">
        <p className="text-center text-sm text-gray-500 -mt-4 mb-2">
          Sisa kesempatan: {sisaKesempatan}
        </p>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukan email"
          />
          {errors.email && <p className="text-red-600 text-sm italic mt-1">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Masukan password"
            />
            <button
              type="button"
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="text-red-600 text-sm italic mt-1">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center text-sm text-gray-700">
            <input
              type="checkbox"
              name="remberMe"
              checked={formData.remberMe || false}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, remberMe: e.target.checked }))
              }
              className="mr-2 h-4 w-4 rounded border-gray-300"
            />
            Ingat Saya
          </label>
          <Link href="/auth/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm font-semibold">
            Forgot Password?
          </Link>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700">Captcha:</span>
            <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-1.5 rounded select-none">
              {captchaText}
            </span>
            <button
              type="button"
              onClick={handleRefreshCaptcha}
              className="text-blue-600 hover:text-blue-800 transition"
              title="Refresh Captcha"
            >
              <FaSyncAlt />
            </button>
          </div>
          <input
            type="text"
            name="captchaInput"
            value={formData.captchaInput}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 rounded-lg border ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukan captcha"
          />
          {errors.captcha && <p className="text-red-600 text-sm italic mt-1">{errors.captcha}</p>}
        </div>

        <div className="flex flex-col space-y-3">
          <button
            type="submit"
            disabled={sisaKesempatan === 0}
            className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-colors ${
              sisaKesempatan === 0 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Sign In
          </button>
          
          <button
            type="button"
            disabled={sisaKesempatan > 0}
            onClick={() => {
              setSisaKesempatan(3);
              toast.success('Kesempatan login berhasil direset!', { theme: 'dark', position: 'top-right' });
            }}
            className={`w-full font-semibold py-2.5 px-4 rounded-lg transition-colors ${
              sisaKesempatan > 0
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Reset Kesempatan
          </button>
        </div>

        <SocialAuth />

        <p className="mt-6 text-center text-sm text-gray-600">
          Tidak punya akun?{' '}
          <Link href="/auth/register" className="text-blue-600 hover:text-blue-800 font-semibold">
            Daftar
          </Link>
        </p>
      </form>
    </AuthFormWrapper>
  );
};

export default LoginPage;

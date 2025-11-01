import React, { useState } from "react";
import { motion } from "framer-motion";
import { Package, MapPin } from "lucide-react";
import { ScreenProps } from "./common";
import NavigationButtons from "../common/NavigationButtons";
import RegionDropdown, { US_STATES } from "../common/RegionDropdown";

const normalizeStateCode = (raw: unknown): string => {
  if (typeof raw !== "string") return "";
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^[A-Za-z]{2}$/.test(trimmed)) {
    return trimmed.toUpperCase();
  }
  const normalized = trimmed.toLowerCase();
  const match = US_STATES.find(
    (state) =>
      state.code.toLowerCase() === normalized ||
      state.name.toLowerCase() === normalized
  );
  if (match) {
    return match.code;
  }
  return trimmed.slice(0, 2).toUpperCase();
};

export default function ShippingAddressScreen({
  answers,
  updateAnswer,
  onSubmit,
  showBack,
  onBack,
}: ScreenProps) {
  const [address, setAddress] = useState(() =>
    typeof answers.shipping_address === "string" ? answers.shipping_address : ""
  );
  const [address2, setAddress2] = useState(() =>
    typeof answers.shipping_address2 === "string"
      ? answers.shipping_address2
      : ""
  );
  const [city, setCity] = useState(() =>
    typeof answers.shipping_city === "string" ? answers.shipping_city : ""
  );
  const [state, setState] = useState(() =>
    normalizeStateCode(answers.shipping_state || answers.home_state || "")
  );
  const [zipCode, setZipCode] = useState(() =>
    typeof answers.shipping_zip === "string" ? answers.shipping_zip : ""
  );
  const [phone, setPhone] = useState(() =>
    typeof answers.phone === "string" ? answers.phone : ""
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!address.trim()) newErrors.address = "Address is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!state.trim()) newErrors.state = "State is required";
    if (!zipCode.trim()) newErrors.zipCode = "ZIP code is required";
    else if (!/^\d{5}$/.test(zipCode.trim()))
      newErrors.zipCode = "Enter a valid 5-digit ZIP code";

    const trimmedPhone = phone.trim();
    const phoneDigits = trimmedPhone.replace(/[^0-9]/g, "");
    if (!trimmedPhone) newErrors.phone = "Phone number is required";
    else if (phoneDigits.length < 10 || phoneDigits.length > 15)
      newErrors.phone = "Enter a valid phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Save all shipping data
    updateAnswer("shipping_address", address.trim());
    updateAnswer("shipping_address2", address2.trim());
    updateAnswer("shipping_city", city.trim());
    updateAnswer("shipping_state", normalizeStateCode(state));
    updateAnswer("shipping_zip", zipCode.trim());
    updateAnswer("phone", phone.trim());
    
    // Also save to common fields
    updateAnswer("address_line1", address.trim());
    updateAnswer("address_line2", address2.trim());
    updateAnswer("city", city.trim());
    updateAnswer("state", normalizeStateCode(state));
    updateAnswer("zip_code", zipCode.trim());

    onSubmit();
  };

  return (
    <div className="min-h-screen bg-[#fef8f2] flex justify-center p-4 sm:p-6 pt-5 sm:pt-7">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Title */}
          <div className="mb-10 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#00A896] to-[#E0F5F3] mb-6 shadow-lg"
            >
              <Package className="w-8 h-8 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl sm:text-3xl md:text-4xl text-neutral-900 mb-3 sm:mb-4 leading-snug tracking-tight"
              style={{ letterSpacing: "-0.02em" }}
            >
              Where should we send your medication?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-base sm:text-lg text-neutral-600 leading-relaxed"
            >
              We'll deliver directly to your door with discreet packaging
            </motion.p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-[#E8E8E8] space-y-5"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-[#E0F5F3] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#00A896]" />
              </div>
              <h3 className="text-[#2D3436] font-medium">Delivery Address</h3>
            </div>

            <div>
              <label className="block text-sm text-[#2D3436] mb-2 font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) {
                    setErrors((prev) => {
                      const { phone: _, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.phone ? "border-[#FF6B6B]" : "border-[#E8E8E8]"
                } focus:border-[#00A896] focus:outline-none transition-colors text-[#2D3436] placeholder:text-[#666666]`}
                placeholder="(555) 123-4567"
                autoComplete="tel"
              />
              {errors.phone && (
                <p className="text-sm text-[#FF6B6B] mt-1.5">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#2D3436] mb-2 font-medium">
                Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) {
                    setErrors((prev) => {
                      const { address: _, ...rest } = prev;
                      return rest;
                    });
                  }
                }}
                className={`w-full px-4 py-3 rounded-xl border-2 ${
                  errors.address ? "border-[#FF6B6B]" : "border-[#E8E8E8]"
                } focus:border-[#00A896] focus:outline-none transition-colors text-[#2D3436] placeholder:text-[#666666]`}
                placeholder="123 Main St"
                autoComplete="street-address"
              />
              {errors.address && (
                <p className="text-sm text-[#FF6B6B] mt-1.5">
                  {errors.address}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#2D3436] mb-2 font-medium">
                Apartment, Suite, etc.{" "}
                <span className="text-[#666666] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#E8E8E8] focus:border-[#00A896] focus:outline-none transition-colors text-[#2D3436] placeholder:text-[#666666]"
                placeholder="Apt 4B"
                autoComplete="address-line2"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="block text-sm text-[#2D3436] mb-2 font-medium">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    if (errors.city) {
                      setErrors((prev) => {
                        const { city: _, ...rest } = prev;
                        return rest;
                      });
                    }
                  }}

import React, { useState } from "react";
import {
  FaMotorcycle,
  FaCar,
  FaBicycle,
  FaTruck,
  FaUser,
} from "react-icons/fa";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../../Hook/useAxiosSecure";

const BeARaider = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [selectedVehicle, setSelectedVehicle] = useState("motorcycle");
  const axiosSecure = useAxiosSecure();

  const vehicleTypes = [
    {
      id: "motorcycle",
      name: "Motorcycle",
      icon: FaMotorcycle,
      description: "Fast delivery for small packages",
    },
    {
      id: "bicycle",
      name: "Bicycle",
      icon: FaBicycle,
      description: "Eco-friendly option for nearby deliveries",
    },
    {
      id: "car",
      name: "Car",
      icon: FaCar,
      description: "Medium packages and longer distances",
    },
    {
      id: "truck",
      name: "Truck",
      icon: FaTruck,
      description: "Large packages and bulk deliveries",
    },
  ];

  const onSubmit = (data) => {
    const formData = { ...data, vehicleType: selectedVehicle };

    console.log("Rider application data:", formData);
    axiosSecure.post("/riders", formData).then((res) => {
      if (res.data.insertedId) {
        Swal.fire({
          title: "Application Submitted!",
          text: "Thank you for your interest in becoming a ProFast rider. We will review your application and contact you within 2-3 business days.",
          icon: "success",
          confirmButtonText: "Great!",
          confirmButtonColor: "#CAEB66",
          timer: 5000,
          timerProgressBar: true,
        });
      }
    });
  };

  return (
    <div className="min-h-screen">
      {/* Application Form */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="w-full max-w-full mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-[#03373D] mb-4">
                Apply to Become a Rider
              </h2>
              <p className="text-gray-600 text-lg">
                Fill out the form below and we'll get back to you within 2-3
                business days
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-2xl font-semibold text-[#03373D] mb-6 flex items-center gap-2">
                    <FaUser className="text-[#CAEB66]" />
                    Personal Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#03373D] mb-2">
                        Full Name *
                      </label>
                      <input
                        {...register("fullName", {
                          required: "Full name is required",
                        })}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#03373D] mb-2">
                        Email Address *
                      </label>
                      <input
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid email address",
                          },
                        })}
                        type="email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
                        placeholder="Enter your email"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#03373D] mb-2">
                        Phone Number *
                      </label>
                      <input
                        {...register("phone", {
                          required: "Phone number is required",
                        })}
                        type="tel"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#03373D] mb-2">
                        Date of Birth *
                      </label>
                      <input
                        {...register("dateOfBirth", {
                          required: "Date of birth is required",
                        })}
                        type="date"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
                      />
                      {errors.dateOfBirth && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.dateOfBirth.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-[#03373D] mb-2">
                      Address *
                    </label>
                    <textarea
                      {...register("address", {
                        required: "Address is required",
                      })}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
                      placeholder="Enter your complete address"
                    />
                    {errors.address && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.address.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Vehicle Selection */}
                <div>
                  <h3 className="text-2xl font-semibold text-[#03373D] mb-6 flex items-center gap-2">
                    <FaMotorcycle className="text-[#CAEB66]" />
                    Vehicle Information
                  </h3>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-[#03373D] mb-4">
                      Select Your Vehicle Type *
                    </label>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {vehicleTypes.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          onClick={() => setSelectedVehicle(vehicle.id)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedVehicle === vehicle.id
                              ? "border-[#CAEB66] bg-[#CAEB66]/10"
                              : "border-gray-300 hover:border-[#CAEB66]/50"
                          }`}
                        >
                          <div className="text-center">
                            <vehicle.icon
                              className={`text-3xl mx-auto mb-2 ${
                                selectedVehicle === vehicle.id
                                  ? "text-[#03373D]"
                                  : "text-gray-400"
                              }`}
                            />
                            <h4 className="font-semibold text-[#03373D] mb-1">
                              {vehicle.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {vehicle.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-[#03373D] mb-2">
                        Vehicle Model *
                      </label>
                      <input
                        {...register("vehicleModel", {
                          required: "Vehicle model is required",
                        })}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
                        placeholder="e.g., Honda CB150R"
                      />
                      {errors.vehicleModel && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.vehicleModel.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#03373D] mb-2">
                        License Plate Number *
                      </label>
                      <input
                        {...register("licensePlate", {
                          required: "License plate is required",
                        })}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
                        placeholder="e.g., ABC-1234"
                      />
                      {errors.licensePlate && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.licensePlate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-2xl font-semibold text-[#03373D] mb-6">
                    Additional Information
                  </h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#03373D] mb-2">
                        Previous Delivery Experience
                      </label>
                      <textarea
                        {...register("experience")}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
                        placeholder="Tell us about your previous delivery or driving experience (optional)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#03373D] mb-2">
                        Preferred Working Areas
                      </label>
                      <input
                        {...register("preferredAreas")}
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent"
                        placeholder="e.g., Dhaka, Gulshan, Dhanmondi (optional)"
                      />
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        {...register("terms", {
                          required: "You must agree to the terms",
                        })}
                        type="checkbox"
                        id="terms"
                        className="mt-1 w-4 h-4 text-[#CAEB66] border-gray-300 rounded focus:ring-[#CAEB66] focus:ring-2"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-[#03373D] hover:text-[#CAEB66] transition-colors duration-200"
                        >
                          Terms and Conditions
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-[#03373D] hover:text-[#CAEB66] transition-colors duration-200"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    {errors.terms && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.terms.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-[#CAEB66] text-[#03373D] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 hover:transform hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Submit Application
                  </button>
                  <p className="text-sm text-gray-600 mt-4">
                    We'll review your application and get back to you within 2-3
                    business days
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeARaider;

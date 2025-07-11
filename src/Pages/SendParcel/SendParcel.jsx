import React, { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAuth from "../../Hook/useAuth";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import useAxiosSecure from "../../Hook/useAxiosSecure";

const SendParcel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-out-cubic",
      once: true,
      mirror: false,
      offset: 50,
      disable: "mobile",
    });

    return () => {
      AOS.refresh();
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      // Parcel Info
      type: "",
      title: "",
      weight: "",

      // Sender Info
      senderName: user?.displayName || "",
      senderContact: "",
      senderRegion: "",
      senderServiceCenter: "",
      senderAddress: "",
      pickupInstruction: "",

      // Receiver Info
      receiverName: "",
      receiverContact: "",
      receiverRegion: "",
      receiverServiceCenter: "",
      receiverAddress: "",
      deliveryInstruction: "",
    },
  });

  // Watch specific fields for dynamic updates
  const watchedType = useWatch({ control, name: "type" });
  const watchedSenderRegion = useWatch({ control, name: "senderRegion" });
  const watchedReceiverRegion = useWatch({ control, name: "receiverRegion" });

  const [regions] = useState([
    "Dhaka",
    "Chittagong",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Sylhet",
    "Rangpur",
    "Mymensingh",
  ]);

  const [serviceCenters] = useState({
    Dhaka: ["Dhanmondi", "Gulshan", "Uttara", "Old Dhaka", "Wari"],
    Chittagong: ["Agrabad", "Nasirabad", "Panchlaish", "Halishahar"],
    Rajshahi: ["Shaheb Bazar", "Uposhohor", "Rajpara"],
    Khulna: ["Moylapota", "Sonadanga", "Khalishpur"],
    Barisal: ["Sadar Road", "Band Road", "Nathullabad"],
    Sylhet: ["Zindabazar", "Amberkhana", "Subhanighat"],
    Rangpur: ["Guptapara", "Mahiganj", "Modern"],
    Mymensingh: ["Charpara", "Ganginarpar", "Town Hall"],
  });

  // Reset service center when region changes
  React.useEffect(() => {
    setValue("senderServiceCenter", "");
  }, [watchedSenderRegion, setValue]);

  React.useEffect(() => {
    setValue("receiverServiceCenter", "");
  }, [watchedReceiverRegion, setValue]);

  const calculateCost = (formData) => {
    let cost = 0;
    const sameRegion = formData.senderRegion === formData.receiverRegion;

    if (formData.type === "document") {
      // Document pricing
      cost = sameRegion ? 60 : 80;
    } else if (formData.type === "non-document") {
      // Non-document pricing
      const weight = parseFloat(formData.weight) || 0;

      if (weight <= 3) {
        // Up to 3kg
        cost = sameRegion ? 110 : 150;
      } else {
        // Over 3kg
        const basePrice = sameRegion ? 110 : 150;
        const extraWeight = weight - 3;
        const extraCost = Math.ceil(extraWeight) * 40;
        const outsideCityExtra = sameRegion ? 0 : 40;
        cost = basePrice + extraCost + outsideCityExtra;
      }
    }

    return Math.round(cost);
  };

  const onSubmit = async (formData) => {
    const deliveryCost = calculateCost(formData);
    const sameRegion = formData.senderRegion === formData.receiverRegion;

    // Calculate cost breakdown
    let costBreakdown = "";
    if (formData.type === "document") {
      costBreakdown = `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
          <h4 style="margin: 0 0 10px 0; color: #2c3e50;">💰 Cost Breakdown:</h4>
          <p style="margin: 5px 0;"><span style="color: #7f8c8d;">📄 Document delivery (${
            sameRegion ? "Same region" : "Different region"
          }):</span> <strong>৳${deliveryCost}</strong></p>
          ${
            !sameRegion
              ? '<p style="margin: 5px 0; color: #e67e22; font-size: 12px;">• Cross-region delivery charge included</p>'
              : ""
          }
        </div>
      `;
    } else if (formData.type === "non-document") {
      const weight = parseFloat(formData.weight) || 0;
      let basePrice = sameRegion ? 110 : 150;
      let extraCost = 0;
      let outsideCityExtra = 0;

      if (weight > 3) {
        const extraWeight = weight - 3;
        extraCost = Math.ceil(extraWeight) * 40;
        outsideCityExtra = sameRegion ? 0 : 40;
      }

      costBreakdown = `
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 10px 0;">
          <h4 style="margin: 0 0 10px 0; color: #2c3e50;">💰 Cost Breakdown:</h4>
          <p style="margin: 5px 0;"><span style="color: #7f8c8d;">📦 Base price (${
            sameRegion ? "Same region" : "Different region"
          }, up to 3kg):</span> <strong>৳${basePrice}</strong></p>
          ${
            weight > 3
              ? `
            <p style="margin: 5px 0;"><span style="color: #7f8c8d;">⚖️ Extra weight (${(
              weight - 3
            ).toFixed(1)}kg × ৳40):</span> <strong>৳${extraCost}</strong></p>
            ${
              !sameRegion
                ? `<p style="margin: 5px 0;"><span style="color: #7f8c8d;">🌍 Cross-region extra charge:</span> <strong>৳${outsideCityExtra}</strong></p>`
                : ""
            }
          `
              : ""
          }
          ${
            !sameRegion && weight <= 3
              ? '<p style="margin: 5px 0; color: #e67e22; font-size: 12px;">• Cross-region delivery charge included</p>'
              : ""
          }
          <hr style="margin: 10px 0; border: 1px solid #ecf0f1;">
          <p style="margin: 5px 0; font-size: 16px;"><span style="color: #2c3e50;">💳 Total Cost:</span> <strong style="color: #e74c3c;">৳${deliveryCost}</strong></p>
        </div>
      `;
    }

    // Show detailed confirmation
    const result = await Swal.fire({
      title: "📋 Confirm Your Parcel Booking",
      html: `
        <div style="text-align: left; max-width: 500px; margin: 0 auto;">
          <!-- Parcel Details -->
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #27ae60;">📦 Parcel Details:</h4>
            <p style="margin: 5px 0;"><span style="color: #7f8c8d;">Title:</span> <strong>${
              formData.title
            }</strong></p>
            <p style="margin: 5px 0;"><span style="color: #7f8c8d;">Type:</span> <strong>${
              formData.type === "document" ? "📄 Document" : "📦 Non-Document"
            }</strong></p>
            ${
              formData.weight
                ? `<p style="margin: 5px 0;"><span style="color: #7f8c8d;">Weight:</span> <strong>${formData.weight} kg</strong></p>`
                : ""
            }
          </div>
          
          <!-- Pickup & Delivery Info -->
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h4 style="margin: 0 0 10px 0; color: #856404;">🚚 Pickup & Delivery:</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 5px 0; font-weight: bold; color: #d35400;">📍 From:</p>
                <p style="margin: 2px 0; font-size: 14px;">${
                  formData.senderName
                }</p>
                <p style="margin: 2px 0; font-size: 14px;">${
                  formData.senderRegion
                } - ${formData.senderServiceCenter}</p>
                <p style="margin: 2px 0; font-size: 14px;">📞 ${
                  formData.senderContact
                }</p>
              </div>
              <div>
                <p style="margin: 5px 0; font-weight: bold; color: #27ae60;">🎯 To:</p>
                <p style="margin: 2px 0; font-size: 14px;">${
                  formData.receiverName
                }</p>
                <p style="margin: 2px 0; font-size: 14px;">${
                  formData.receiverRegion
                } - ${formData.receiverServiceCenter}</p>
                <p style="margin: 2px 0; font-size: 14px;">📞 ${
                  formData.receiverContact
                }</p>
              </div>
            </div>
          </div>
          
          ${costBreakdown}
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Proceed to Payment",
      confirmButtonColor: "#27ae60",
      cancelButtonColor: "#e74c3c",
      width: "700px",
      customClass: {
        popup: "swal-wide",
      },
    });

    if (result.isConfirmed) {
      try {
        // Save to database (you'll need to implement the API call)
        const parcelData = {
          ...formData,
          cost: deliveryCost,
          creation_date: new Date().toISOString(),
          userId: user?.uid,
          userEmail: user?.email,
          userDisplayName: user?.displayName,
          userPhotoURL: user?.photoURL,
          bookingTimestamp: Date.now(),
          status: "pending",
          trackingNumber: `PRO${Date.now()}${Math.floor(Math.random() * 1000)}`,
        };

        // Save to database
        try {
          const res = await axiosSecure.post("/parcels", parcelData);
          console.log(res.data);
          
          if (res.data.insertedId) {
            Swal.fire({
              icon: "success",
              title: "Parcel Booked Successfully!",
              text: `Your parcel has been booked. Delivery cost: ৳${deliveryCost}. Tracking Number: ${parcelData.trackingNumber}`,
              confirmButtonText: "Go to My Parcels",
              cancelButtonText: "Stay Here",
              showCancelButton: true,
              confirmButtonColor: "#03373D",
              cancelButtonColor: "#6c757d",
              allowOutsideClick: false
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/dashboard/myParcels");
              }
            });
            
            // Reset form after successful submission
            reset({
              type: "",
              title: "",
              weight: "",
              senderName: user?.displayName || "",
              senderContact: "",
              senderRegion: "",
              senderServiceCenter: "",
              senderAddress: "",
              pickupInstruction: "",
              receiverName: "",
              receiverContact: "",
              receiverRegion: "",
              receiverServiceCenter: "",
              receiverAddress: "",
              deliveryInstruction: "",
            });
          }
        } catch (apiError) {
          console.error("API Error:", apiError);
          Swal.fire({
            icon: "error",
            title: "Booking Failed",
            text: "There was an error booking your parcel. Please try again.",
            confirmButtonColor: "#e74c3c"
          });
        }
      } catch (error) {
        console.error("Form submission error:", error);
        Swal.fire({
          icon: "error",
          title: "Booking Failed",
          text: "There was an error booking your parcel. Please try again.",
          confirmButtonColor: "#e74c3c"
        });
      }
    }
  };

  return (
    <div className="">
      <div className="container mx-auto py-8 lg:py-12">
        <div className="w-full">
          {/* Header */}
          <div className="text-center mb-8 lg:mb-12" data-aos="fade-up">
            <h1 className="text-3xl lg:text-5xl font-bold text-[#03373D] mb-4">
              Send Your Parcel
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
              Fast, reliable door-to-door delivery service across Bangladesh
              with real-time tracking
            </p>
          </div>

          {/* Form */}
          <div
            className="bg-white shadow-xl rounded-2xl lg:rounded-3xl overflow-hidden"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Parcel Information Section */}
              <div
                className="bg-[#03373D] px-6 lg:px-12 py-8 lg:py-12"
                data-aos="fade-up"
                data-aos-delay="150"
              >
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6 lg:mb-8 text-center">
                  📦 Parcel Information
                </h2>
                <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">
                      Parcel Type <span className="text-[#CAEB66]">*</span>
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          {...register("type", {
                            required: "Parcel type is required",
                          })}
                          value="document"
                          className="mr-3 w-4 h-4 text-[#CAEB66] focus:ring-[#CAEB66] focus:ring-2"
                        />
                        
                        <span className="text-white font-medium">Document</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          {...register("type", {
                            required: "Parcel type is required",
                          })}
                          value="non-document"
                          className="mr-3 w-4 h-4 text-[#CAEB66] focus:ring-[#CAEB66] focus:ring-2"
                        />
                        <span className="text-white font-medium">
                          Non-Document
                        </span>
                      </label>
                    </div>
                    {errors.type && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.type.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-3">
                      Parcel Title <span className="text-[#CAEB66]">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("title", {
                        required: "Parcel title is required",
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200 text-white"
                      placeholder="e.g., Important Documents"
                    />
                    {errors.title && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  {watchedType === "non-document" && (
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-white mb-3">
                        Weight (kg) <span className="text-[#CAEB66]">*</span>
                      </label>
                      <input
                        type="number"
                        {...register("weight", {
                          required:
                            watchedType === "non-document"
                              ? "Weight is required for non-document parcels"
                              : false,
                          min: {
                            value: 0.1,
                            message: "Weight must be at least 0.1 kg",
                          },
                        })}
                        step="0.1"
                        min="0.1"
                        className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200 text-white"
                        placeholder="e.g., 2.5"
                      />
                      {errors.weight && (
                        <p className="text-red-400 text-sm mt-2">
                          {errors.weight.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Sender & Receiver Information */}
              <div
                className="px-6 lg:px-12 py-8 lg:py-12"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <h2 className="text-2xl lg:text-3xl font-bold text-[#03373D] mb-8 lg:mb-12 text-center">
                  Pickup & Delivery Information
                </h2>
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                  {/* Sender Information */}
                  <div
                    className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 lg:p-8 rounded-2xl border border-gray-200"
                    data-aos="slide-right"
                    data-aos-delay="250"
                  >
                    <div className="text-center mb-6">
                      <div className="bg-[#03373D] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">📦</span>
                      </div>
                      <h3 className="text-xl lg:text-2xl font-bold text-[#03373D]">
                        Sender Information
                      </h3>
                      <p className="text-gray-600 text-sm">Pickup details</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-[#03373D] mb-2">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("senderName", {
                            required: "Sender name is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200"
                        />
                        {errors.senderName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.senderName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#03373D] mb-2">
                          Contact <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          {...register("senderContact", {
                            required: "Contact number is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200"
                          placeholder="01XXXXXXXXX"
                        />
                        {errors.senderContact && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.senderContact.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#03373D] mb-2">
                          Region <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register("senderRegion", {
                            required: "Sender region is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select Region</option>
                          {regions.map((region) => (
                            <option key={region} value={region}>
                              {region}
                            </option>
                          ))}
                        </select>
                        {errors.senderRegion && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.senderRegion.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#03373D] mb-2">
                          Service Center <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register("senderServiceCenter", {
                            required: "Sender service center is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                          disabled={!watchedSenderRegion}
                        >
                          <option value="">Select Service Center</option>
                          {watchedSenderRegion &&
                            serviceCenters[watchedSenderRegion]?.map(
                              (center) => (
                                <option key={center} value={center}>
                                  {center}
                                </option>
                              )
                            )}
                        </select>
                        {errors.senderServiceCenter && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.senderServiceCenter.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#03373D] mb-2">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          {...register("senderAddress", {
                            required: "Sender address is required",
                          })}
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200 resize-none"
                          placeholder="Enter full pickup address"
                        />
                        {errors.senderAddress && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.senderAddress.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#03373D] mb-2">
                          Pickup Instruction
                        </label>
                        <textarea
                          {...register("pickupInstruction")}
                          rows="2"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200 resize-none"
                          placeholder="Special instructions for pickup (optional)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Receiver Information */}
                  <div
                    className="bg-gradient-to-br from-[#CAEB66]/10 to-[#CAEB66]/20 p-6 lg:p-8 rounded-2xl border border-[#CAEB66]/30"
                    data-aos="slide-left"
                    data-aos-delay="300"
                  >
                    <div className="text-center mb-6">
                      <div className="bg-[#CAEB66] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🎯</span>
                      </div>
                      <h3 className="text-xl lg:text-2xl font-bold text-[#03373D]">
                        Receiver Information
                      </h3>
                      <p className="text-gray-600 text-sm">Delivery details</p>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-[#03373D] mb-2">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          {...register("receiverName", {
                            required: "Receiver name is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200 bg-white"
                        />
                        {errors.receiverName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.receiverName.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#03373D] mb-2">
                          Contact <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          {...register("receiverContact", {
                            required: "Contact number is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200 bg-white"
                          placeholder="01XXXXXXXXX"
                        />
                        {errors.receiverContact && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.receiverContact.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#03373D] mb-2">
                          Region <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register("receiverRegion", {
                            required: "Receiver region is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200 bg-white"
                        >
                          <option value="">Select Region</option>
                          {regions.map((region) => (
                            <option key={region} value={region}>
                              {region}
                            </option>
                          ))}
                        </select>
                        {errors.receiverRegion && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.receiverRegion.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#03373D] mb-2">
                          Service Center <span className="text-red-500">*</span>
                        </label>
                        <select
                          {...register("receiverServiceCenter", {
                            required: "Receiver service center is required",
                          })}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                          disabled={!watchedReceiverRegion}
                        >
                          <option value="">Select Service Center</option>
                          {watchedReceiverRegion &&
                            serviceCenters[watchedReceiverRegion]?.map(
                              (center) => (
                                <option key={center} value={center}>
                                  {center}
                                </option>
                              )
                            )}
                        </select>
                        {errors.receiverServiceCenter && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.receiverServiceCenter.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#03373D] mb-2">
                          Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          {...register("receiverAddress", {
                            required: "Receiver address is required",
                          })}
                          rows="3"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200 bg-white resize-none"
                          placeholder="Enter full delivery address"
                        />
                        {errors.receiverAddress && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.receiverAddress.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#03373D] mb-2">
                          Delivery Instruction
                        </label>
                        <textarea
                          {...register("deliveryInstruction")}
                          rows="2"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:border-transparent transition-all duration-200 bg-white resize-none"
                          placeholder="Special instructions for delivery (optional)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button Section */}
              <div
                className="bg-[#03373D] px-6 lg:px-12 py-8 lg:py-12 text-center"
                data-aos="fade-up"
                data-aos-delay="350"
              >
                <button
                  type="submit"
                  className="bg-[#CAEB66] text-[#03373D] py-4 px-8 lg:px-12 rounded-xl lg:rounded-2xl font-bold text-lg lg:text-xl hover:bg-opacity-90 hover:transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Calculate Cost & Book Parcel
                </button>
                <p className="text-gray-300 text-sm mt-4">
                  Get instant pricing and confirm your booking
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendParcel;

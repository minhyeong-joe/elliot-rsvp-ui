import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useForm } from "react-hook-form";

import FloralDivider from "~/components/Divider";
import { api } from "~/lib/api";

import "~/styles/rsvp.css";

type RSVPFormValues = {
    name: string;
    isAttending: string;
    hasChildren?: string;
    numChildren?: number;
    hasAllergies?: string;
    allergyDetails?: string;
    message?: string;
    anonymous?: boolean;
    guess?: string;
};

export default function RSVP() {
    const { register, formState: { errors }, handleSubmit, watch, resetField } = useForm<RSVPFormValues>();
    const isAttendingValue = watch("isAttending");
    const hasChildrenValue = watch("hasChildren");
    const hasAllergiesValue = watch("hasAllergies");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (isAttendingValue !== "true") {
            resetField("hasChildren");
            resetField("numChildren");
            resetField("hasAllergies");
            resetField("allergyDetails");
            resetField("message");
            resetField("anonymous");
            resetField("guess");
        }
    }, [isAttendingValue, resetField]);

    useEffect(() => {
        if (hasChildrenValue !== "true") {
            resetField("numChildren");
        }
    }, [hasChildrenValue, resetField]);

    useEffect(() => {
        if (hasAllergiesValue !== "true") {
            resetField("allergyDetails");
        }
    }, [hasAllergiesValue, resetField]);

    const onSubmit = async (data: RSVPFormValues) => {
        setIsSubmitting(true);
        setSubmitError(null);

        const payload = {
            name: data.name.trim(),
            isAttending: data.isAttending === "true",
            hasChildren: data.hasChildren === "true",
            numChildren: data.numChildren ? Number(data.numChildren) : 0,
            hasAllergies: data.hasAllergies === "true",
            allergyDetails: data.allergyDetails ? data.allergyDetails.trim() : "",
            message: data.message ? data.message.trim() : "",
            anonymous: data.anonymous || false,
            guess: data.guess || "",
        };

        // console.log("Form Submitted:", payload);

        try {
            await api.post("/rsvp", payload);
            setShowSuccessModal(true);
        } catch (error) {
            setSubmitError("Failed to submit RSVP. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main>
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
                        <div className="text-center">
                            <div className="text-6xl mb-4">✅</div>
                            <h2 className="text-3xl font-bold text-formal mb-4">감사합니다!</h2>
                            <p className="text-xl text-formal mb-6">
                                RSVP가 성공적으로 제출되었습니다
                            </p>
                            <FloralDivider />
                            <div className="text-lg text-gray-700 my-6 space-y-2">
                                <p className="font-semibold">은성이의 돌잔치</p>
                                <p>곧 뵙겠습니다! 🎉</p>
                            </div>
                            <NavLink 
                                to="/" 
                                className="inline-block bg-cyan-500 text-white px-8 py-3 rounded-3xl hover:bg-indigo-600 transition duration-300 font-semibold text-playful text-xl"
                            >
                                홈으로 돌아가기
                            </NavLink>
                        </div>
                    </div>
                </div>
            )}
            <div className="container mx-auto py-8 px-4">
                <form onSubmit={handleSubmit(onSubmit)} className="rsvp-form container mx-auto p-4 my-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-5xl lg:text-6xl text-center text-formal">RSVP</h2>
                    <FloralDivider />

                    <div className="form-group mb-6 display-flex flex-direction-column">
                        <label htmlFor="name" className="text-2xl font-medium p-1 mb-2 mr-3 text-formal">성함<span className="text-red-500 text-sm align-top">*</span></label>
                        <input
                            type="text"
                            id="name"
                            autoComplete="name"
                            className="p-1 w-30 sm:w-60 border-0 border-b border-gray-300 rounded-none bg-transparent focus:outline-none focus:ring-0 focus:border-indigo-500 text-formal text-2xl"
                            {...register("name", { required: true })}
                        />
                        {errors.name?.type === "required" && (
                            <p className="text-red-500 text-sm mt-1">성함을 입력해 주세요.</p>
                        )}
                    </div>

                    <div className="form-group mb-6">
                        <label className="text-2xl font-medium p-1 mb-2 text-formal">돌잔치에 참석 하시나요?<span className="text-red-500 text-sm align-top">*</span></label>
                        {errors.isAttending?.type === "required" && (
                            <p className="text-red-500 text-sm mt-1">참석 여부를 선택해 주세요.</p>
                        )}
                        <div className="mt-2">
                            <input
                                type="radio"
                                id="attending-yes"
                                value="true"
                                className="mx-2 cursor-pointer"
                                {...register("isAttending", { required: true })}
                            />
                            <label htmlFor="attending-yes" className="text-formal text-2xl cursor-pointer">네, 참석합니다</label>
                        </div>
                        <div className="mt-2">
                            <input
                                type="radio"
                                id="attending-no"
                                value="false"
                                className="mx-2 cursor-pointer"
                                {...register("isAttending", { required: true })}
                            />
                            <label htmlFor="attending-no" className="text-formal text-2xl cursor-pointer">아니요, 아쉽게도 참석이 어렵습니다</label>
                        </div>
                    </div>

                    {isAttendingValue === "true" && (
                        <>
                            {/* only show and require below if attending yes is selected */}
                            <div className="form-group mb-6">
                                <label className="text-2xl font-medium p-1 mb-2 text-formal">만 5세 이하 자녀를 동반하시나요?<span className="text-red-500 text-sm align-top">*</span></label>
                                <label className="text-sm text-gray-600">(자녀 동반 시 별도의 어린이 식사가 제공됩니다)</label>
                                {errors.hasChildren?.type === "required" && (
                                    <p className="text-red-500 text-sm mt-1">자녀 동반 여부를 선택해 주세요.</p>
                                )}
                                <div className="mt-2">
                                    <input
                                        type="radio"
                                        id="hasChildren-yes"
                                        value="true"
                                        className="mx-2 cursor-pointer"
                                        {...register("hasChildren", { required: true })}
                                    />
                                    <label htmlFor="hasChildren-yes" className="text-formal text-2xl cursor-pointer">네</label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        type="radio"
                                        id="hasChildren-no"
                                        value="false"
                                        className="mx-2 cursor-pointer"
                                        {...register("hasChildren", { required: true })}
                                    />
                                    <label htmlFor="hasChildren-no" className="text-formal text-2xl cursor-pointer">아니오</label>
                                </div>
                            </div>

                            {/* only show and require if hasChildren yes is selected */}
                            {hasChildrenValue === "true" && (
                                <div className="form-group mb-6">
                                    <label htmlFor="numChildren" className="text-2xl font-medium p-1 mb-2 mr-3 text-formal">만 5세 이하 자녀 수<span className="text-red-500 text-sm align-top">*</span></label>
                                    <input
                                        type="number"
                                        id="numChildren"
                                        min="0"
                                        defaultValue="0"
                                        className="p-1 w-8 border-0 border-b border-gray-300 rounded-none bg-transparent focus:outline-none focus:ring-0 focus:border-indigo-500 text-formal text-2xl"
                                        {...register("numChildren", { required: true, min: 0 })}
                                    />
                                    <label htmlFor="numChildren" className="text-formal text-2xl">명</label>
                                </div>
                            )}

                            <div className="form-group mb-6">
                                <label className="text-2xl font-medium p-1 mb-2 text-formal">음식 알레르기가 있으신가요?<span className="text-red-500 text-sm align-top">*</span></label>
                                {errors.hasAllergies?.type === "required" && (
                                    <p className="text-red-500 text-sm mt-1">알레르기 여부를 선택해 주세요.</p>
                                )}
                                <div className="mt-2">
                                    <input
                                        type="radio"
                                        id="hasAllergies-yes"
                                        value="true"
                                        className="mx-2 cursor-pointer"
                                        {...register("hasAllergies", { required: true })}
                                    />
                                    <label htmlFor="hasAllergies-yes" className="text-formal text-2xl cursor-pointer">네</label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        type="radio"
                                        id="hasAllergies-no"
                                        value="false"
                                        className="mx-2 cursor-pointer"
                                        {...register("hasAllergies", { required: true })}
                                    />
                                    <label htmlFor="hasAllergies-no" className="text-formal text-2xl cursor-pointer">아니오</label>
                                </div>
                            </div>

                            {/* only show and require if hasAllergies yes is selected */}
                            {hasAllergiesValue === "true" && (
                                <div className="form-group mb-6">
                                    <label htmlFor="allergyDetails" className="text-2xl font-medium p-1 mb-2 mr-3 text-formal">알레르기 정보<span className="text-red-500 text-sm align-top">*</span></label>
                                    {errors.allergyDetails?.type === "required" && (
                                        <p className="text-red-500 text-sm mt-1">알레르기 정보를 기재해 주세요.</p>
                                    )}
                                    <textarea
                                        id="allergyDetails"
                                        rows={2}
                                        maxLength={200}
                                        className="p-2 w-full border border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-indigo-500 text-formal text-2xl"
                                        placeholder="알레르기 정보를 기재해 주세요. 예: 땅콩, 글루텐 등"
                                        {...register("allergyDetails", { required: true })}
                                    ></textarea>
                                </div>
                            )}

                            <div className="form-group mb-6">
                                <label htmlFor="message" className="text-2xl font-medium p-1 mb-2 mr-3 text-formal">은성이에게 전하는 축하메세지</label>
                                <textarea
                                    id="message"
                                    rows={2}
                                    maxLength={200}
                                    className="p-2 w-full border border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-indigo-500 text-formal text-2xl"
                                    placeholder="형식적인 축하인사보다 훗날 은성이가 읽을 개성 있고 따뜻한 한마디를 남겨주세요"
                                    {...register("message")}
                                ></textarea>
                                <input type="checkbox" id="anonymous" className="mt-2 mr-2 cursor-pointer" {...register("anonymous")} />
                                <label htmlFor="anonymous" className="text-formal text-2xl cursor-pointer">익명으로 남기기</label>
                            </div>

                            <div className="form-group mb-6">
                                <label htmlFor="guess" className="text-2xl font-medium p-1 mb-2 mr-3 text-formal">돌잡이에서 은성이가 어떤 물건을 잡을 지 예측해주세요 😉</label>
                                <label htmlFor="guess" className="block text-sm text-gray-500">(정답자 중 추첨을 통해 소정의 상품을 드립니다!)</label>
                                <select id="guess" className="mt-2 p-2 w-40 sm:w-60 border border-gray-300 rounded-lg bg-transparent focus:outline-none focus:ring-0 focus:border-indigo-500 text-formal text-2xl"
                                    {...register("guess")}>
                                    <option value="">-- 선택해주세요 --</option>
                                    <option value="pen">연필 ✏️</option>
                                    <option value="microphone">마이크 🎤</option>
                                    <option value="ball">공 ⚽</option>
                                    <option value="stethoscope">청진기 🩺</option>
                                    <option value="mouse">마우스 🖱️</option>
                                    <option value="money">돈 💵</option>
                                </select>
                            </div>
                        </>
                    )}

                    <FloralDivider />
                    
                    <div className="flex flex-col items-center justify-center gap-4 mt-8 sm:block">
                        {!isSubmitting && 
                        <>
                            <input type="submit" className="bg-cyan-500 text-white px-8 py-3 rounded-3xl hover:bg-indigo-600 transition duration-300 font-semibold text-playful text-xl cursor-pointer" value="작성 완료" />
                            <NavLink to="/" className="sm:ml-4 bg-gray-300 text-gray-700 px-6 py-3 sm:py-4 rounded-3xl hover:bg-gray-400 transition duration-300 font-semibold text-playful text-xl">
                                돌아가기
                            </NavLink>
                        </>}
                        {isSubmitting && <img src='loader.gif' alt='Submitting...' className="mt-4" />}
                    </div>
                    {submitError && (
                        <p className="text-red-500 text-center mt-4">{submitError}</p>
                    )}
                </form>
            </div>

        </main>
    )
}
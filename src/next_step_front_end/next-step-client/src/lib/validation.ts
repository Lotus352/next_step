export interface ValidationError {
    field: string
    message: string
}

export interface SignInFormData {
    username: string
    password: string
}

export interface SignUpFormData {
    username: string
    email: string
    password: string
    confirmPassword: string
    fullName: string
    phoneNumber: string
}

export const validateSignIn = (data: SignInFormData): ValidationError[] => {
    const errors: ValidationError[] = []

    if (!data.username.trim()) {
        errors.push({ field: "username", message: "Username is required" })
    } else if (data.username.length < 3) {
        errors.push({ field: "username", message: "Username must be at least 3 characters" })
    }

    if (!data.password) {
        errors.push({ field: "password", message: "Password is required" })
    } else if (data.password.length < 6) {
        errors.push({ field: "password", message: "Password must be at least 6 characters" })
    }

    return errors
}

export const validateSignUp = (data: SignUpFormData): ValidationError[] => {
    const errors: ValidationError[] = []

    // Full Name validation
    if (!data.fullName.trim()) {
        errors.push({ field: "fullName", message: "Full name is required" })
    } else if (data.fullName.length < 2) {
        errors.push({ field: "fullName", message: "Full name must be at least 2 characters" })
    } else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(data.fullName)) {
        errors.push({ field: "fullName", message: "Full name can only contain letters and spaces" })
    }

    // Username validation
    if (!data.username.trim()) {
        errors.push({ field: "username", message: "Username is required" })
    } else if (data.username.length < 3) {
        errors.push({ field: "username", message: "Username must be at least 3 characters" })
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
        errors.push({ field: "username", message: "Username can only contain letters, numbers, and underscores" })
    }

    // Email validation
    if (!data.email.trim()) {
        errors.push({ field: "email", message: "Email is required" })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push({ field: "email", message: "Please enter a valid email address" })
    }

    // Phone Number validation
    if (!data.phoneNumber.trim()) {
        errors.push({ field: "phoneNumber", message: "Phone number is required" })
    } else if (!/^[0-9+\-\s()]+$/.test(data.phoneNumber)) {
        errors.push({ field: "phoneNumber", message: "Please enter a valid phone number" })
    } else if (data.phoneNumber.replace(/[^0-9]/g, "").length < 10) {
        errors.push({ field: "phoneNumber", message: "Phone number must be at least 10 digits" })
    }

    // Password validation
    if (!data.password) {
        errors.push({ field: "password", message: "Password is required" })
    } else if (data.password.length < 8) {
        errors.push({ field: "password", message: "Password must be at least 8 characters" })
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.password)) {
        errors.push({
            field: "password",
            message: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        })
    }

    // Confirm Password validation
    if (!data.confirmPassword) {
        errors.push({ field: "confirmPassword", message: "Please confirm your password" })
    } else if (data.password !== data.confirmPassword) {
        errors.push({ field: "confirmPassword", message: "Passwords do not match" })
    }

    return errors
}

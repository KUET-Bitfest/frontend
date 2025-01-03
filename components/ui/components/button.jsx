"use client"
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Icon } from "./icon"
import { Spinner } from "./spinner"
import Link from 'next/link';

const buttonVariantOptions = {
  variants: {
    variant: {
      primary: 'bg-primary text-[#fff] shadow',
      secondary: 'bg-main-border hover:bg-menu-border text-text-primary',
      danger: 'bg-[#FF0000] text-[#fff]',
      outline: 'border border-main-border hover:border-black bg-transparent shadow-sm hover:text-text-primary text-text-primary',
      ghost: 'hover:bg-primary dark:text-[#fff] hover:text-[#fff]',
      icon: 'text-text-primary !px-1 !py-1',
      link: 'text-primary-100 !px-1 !py-1',
      text: 'text-text-primary !px-1 !py-1',
      success: 'bg-[#2ad195] hover:bg-green text-[#fff] font-700',
      dark: 'bg-[#000] text-[#fff]',
      menu: 'bg-primary text-[#fff] shadow rounded-full',
      'outline-secondary': 'bg-[#9A6AFF1A] border border-[#9A6AFF80] text-[#000]',
    },
    size: {
      default: 'px-4 py-2.5',
      xs: 'px-3 py-0.5 text-xs',
      sm: 'px-3 py-1.5 text-xs',
      lg: 'px-5 py-2.5 text-md',
      xl: 'px-6 py-3 text-lg',
      '2xl': 'px-8 py-4 text-2xl',
      '3xl': 'px-10 py-5 text-3xl',
      '4xl': 'px-10 py-5 text-4xl',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
}

const buttonVariants = cva(
  'inline-flex items-center relative justify-center rounded-lg text-sm font-medium transition-color disabled:pointer-events-none disabled:opacity-50 hover:brightness-90 transition-all active:scale-[0.98]',
  buttonVariantOptions
)

const iconSizeMapper = {
  default: 'default',
  lg: 'md',
  sm: 'sm',
  xs: 'xs',
}

const spinnerSizeMapper = {
  default: 'default',
  lg: 'lg',
  sm: 'sm',
  xs: 'sm',
}

const Button = React.forwardRef(({
  className,
  variant,
  size,
  fullWidth,
  containerClassName,
  rounded = true,
  animate,
  children,
  leftIcon,
  rightIcon,
  isLoading,
  asChild = false,
  to,
  center,
  ...props
}, ref) => {
  
  if (asChild) {
    return <Slot {...props}>{children}</Slot>
  }

  const ButtonComponent = ({ children }) => {
    return (
      <div className={cn(
        "w-full",
        center && "flex justify-center items-center"
      )}>
        {children}
      </div>
    )
  }

  const textSize = size || 'default'

  const Comp = to ? Link : "button";
  
  return (
    <ButtonComponent>
      <Comp
        className={cn([
          className,
          'group',
          buttonVariants({
            variant,
            size,
          }),
          animate && 'animate-zoom-in-normal',
          rounded && 'rounded-full',
          isLoading ? 'cursor-wait' : 'cursor-pointer',
          fullWidth && 'w-full',
          center && '!justify-center',
          containerClassName,
        ])}
        ref={ref}
        {...(to ? { href: to } : {})}
        {...props}
      >
        {isLoading && <Spinner size={spinnerSizeMapper[textSize] || 'default'} className="absolute" />}
        <div
          className={cn([
            "flex items-center whitespace-nowrap gap-2",
            isLoading ? 'opacity-0' : '',
            center && 'justify-center',
            className
          ])}
        >
          {leftIcon && leftIcon}
          {children}
          {rightIcon && rightIcon}
        </div>
      </Comp>
    </ButtonComponent>
  )
})

Button.displayName = "Button"

export { Button, buttonVariants, buttonVariantOptions }

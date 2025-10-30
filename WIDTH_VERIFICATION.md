# Width Verification

## Screen A: "How much are you hoping to lose?"
- **Component**: NumberScreen
- **Uses**: ScreenLayout (max-w-2xl = 672px)
- **Form**: `<form className="w-full space-y-8">`
- **Input**: `<Input />` with `w-full px-5 sm:px-6 py-5 sm:py-[18px]`

## Screen B: "What matters most to you in your weight loss journey?"
- **Component**: SingleSelectScreen  
- **Uses**: ScreenLayout (max-w-2xl = 672px)
- **Buttons**: SingleSelectButtonGroup
- **Button**: `w-full py-5 sm:py-[18px] px-5 sm:px-6`

## Comparison

### Container
- Screen A: `<div className="w-full max-w-2xl mx-auto">` (ScreenLayout)
- Screen B: `<div className="w-full max-w-2xl mx-auto">` (ScreenLayout)
- **Result**: SAME ✓

### Content Wrapper
- Screen A: `<form className="w-full space-y-8">`
- Screen B: Direct children in ScreenLayout
- **Potential Issue**: form element might have browser default styles?

### Interactive Element
- Screen A: Input with `w-full px-5 sm:px-6 py-5 sm:py-[18px] rounded-xl sm:rounded-2xl`
- Screen B: Buttons with `w-full py-5 sm:py-[18px] px-5 sm:px-6 rounded-xl sm:rounded-2xl`
- **Result**: SAME padding ✓

## Possible Issues

1. **Browser cache**: User may need hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
2. **Form element**: Browser default margins/padding on form
3. **Something else**: Hidden constraint we haven't found

## Next Step

Check if the form element in NumberScreen needs explicit width reset.

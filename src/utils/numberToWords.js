
export const numberToWords = (num) => {
    if (num === 0) return 'Zero';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const convertLessThanOneThousand = (n) => {
        let result = '';
        
        if (n >= 100) {
            result += ones[Math.floor(n / 100)] + ' Hundred';
            n %= 100;
            if (n > 0) result += ' and ';
        }
        
        if (n >= 20) {
            result += tens[Math.floor(n / 10)];
            n %= 10;
            if (n > 0) result += ' ' + ones[n];
        } else if (n >= 10) {
            result += teens[n - 10];
        } else if (n > 0) {
            result += ones[n];
        }
        
        return result;
    };
    
    const convert = (n) => {
        if (n === 0) return '';
        
        let result = '';
        const crore = Math.floor(n / 10000000);
        const lakh = Math.floor((n % 10000000) / 100000);
        const thousand = Math.floor((n % 100000) / 1000);
        const hundred = n % 1000;
        
        if (crore > 0) {
            result += convertLessThanOneThousand(crore) + ' Crore';
            if (lakh > 0 || thousand > 0 || hundred > 0) result += ' ';
        }
        
        if (lakh > 0) {
            result += convertLessThanOneThousand(lakh) + ' Lakh';
            if (thousand > 0 || hundred > 0) result += ' ';
        }
        
        if (thousand > 0) {
            result += convertLessThanOneThousand(thousand) + ' Thousand';
            if (hundred > 0) result += ' ';
        }
        
        if (hundred > 0) {
            result += convertLessThanOneThousand(hundred);
        }
        
        return result;
    };
    
    const integerPart = Math.floor(num);
    const decimalPart = Math.round((num - integerPart) * 100);
    
    let words = '';
    
    if (integerPart > 0) {
        words = convert(integerPart) + ' Rupees';
    } else {
        words = 'Zero Rupees';
    }
    
    if (decimalPart > 0) {
        if (integerPart > 0) words += ' and ';
        words += convert(decimalPart) + ' Paise';
    }
    
    return words.trim();
};
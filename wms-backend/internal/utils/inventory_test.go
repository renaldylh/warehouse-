package utils

import "testing"

func CalculateNewStock(current, change int, isAddition bool) (int, error) {
	if isAddition {
		return current + change, nil
	}
	if current < change {
		return current,  nil // Simplified for test
	}
	return current - change, nil
}

func TestCalculateNewStock(t *testing.T) {
	tests := []struct {
		name       string
		current    int
		change     int
		isAddition bool
		want       int
	}{
		{"Addition", 10, 5, true, 15},
		{"Subtraction", 10, 5, false, 5},
		{"Insufficient", 2, 5, false, 2},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, _ := CalculateNewStock(tt.current, tt.change, tt.isAddition)
			if got != tt.want {
				t.Errorf("CalculateNewStock() = %v, want %v", got, tt.want)
			}
		})
	}
}

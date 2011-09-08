package edu.harvard.med.hcp.mcknight.game;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class PermutationGenerator {

	private static BigInteger getFactorial(int n) {
		BigInteger fact = BigInteger.ONE;
		for (int i = n; i > 1; i--) {
			fact = fact.multiply(new BigInteger(Integer.toString(i)));
		}
		return fact;
	}
	private int[] a;
	private int[] n;
	private int[] o;
	private BigInteger numLeft;

	// -----------------------------------------------------------
	// Constructor. WARNING: Don't make n too large.
	// Recall that the number of permutations is n!
	// which can be very large, even when n is as small as 20 --
	// 20! = 2,432,902,008,176,640,000 and
	// 21! is too big to fit into a Java long, which is
	// why we use BigInteger instead.
	// ----------------------------------------------------------

	private BigInteger total;

	// ------
	// Reset
	// ------

	public PermutationGenerator(int[] numbers) {
		this.n = numbers;
		if (n.length < 1) {
			throw new IllegalArgumentException("Min 1");
		}
		a = new int[n.length];
		o = new int[n.length];
		Map<Integer, Integer> count = new HashMap<Integer, Integer>();
		for (int i = 0; i < n.length; i++) {
			if (count.containsKey(n[i])) {
				count.put(n[i], count.get(n[i]) + 1);
			} else {
				count.put(n[i], 1);
			}
		}

		total = getFactorial(n.length);
		Set<Integer> keySet = count.keySet();
		for (Integer key : keySet) {
			total = total.divide(getFactorial(count.get(key)));
		}
		reset();
	}

	// ------------------------------------
	// Return total number of permutations
	// ------------------------------------

	public int[] getNext() {

		if (numLeft.equals(total)) {
			numLeft = numLeft.subtract(BigInteger.ONE);
			return o;
		}

		int temp, tempo;

		// Find largest index j with a[j] < a[j+1]

		int j = a.length - 2;
		while (a[j] >= a[j + 1]) {
			j--;
		}

		// Find index k such that a[k] is smallest integer
		// greater than a[j] to the right of a[j]

		int k = a.length - 1;
		while (a[j] >= a[k]) {
			k--;
		}

		temp = a[k];tempo = o[k];
		a[k] = a[j];o[k] = o[j];
		a[j] = temp;o[j] = tempo;
		// Put tail end of permutation after jth position in increasing order

		int r = a.length - 1;
		int s = j + 1;

		while (r > s) {
			temp = a[s];tempo = o[s];
			a[s] = a[r];o[s] = o[r];
			a[r] = temp;o[r] = tempo;
			r--;
			s++;
		}

		numLeft = numLeft.subtract(BigInteger.ONE);
		return o;

	}

	// -----------------------------
	// Are there more permutations?
	// -----------------------------

	public BigInteger getNumLeft() {
		return numLeft;
	}

	// --------------------------------------------------------
	// Generate next permutation (algorithm from Rosen p. 284)
	// --------------------------------------------------------

	public BigInteger getTotal() {
		return total;
	}

	public boolean hasMore() {
		return numLeft.compareTo(BigInteger.ZERO) == 1;
	}
	public void reset() {
		System.arraycopy(n, 0, a, 0, n.length);
		numLeft = new BigInteger(total.toString());
		for (int i = 0; i < o.length; i++) {
			o[i] = i;
		}
	}
}
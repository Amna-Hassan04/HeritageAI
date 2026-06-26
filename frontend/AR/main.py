import sys
from functools import reduce


def process(lines, n, results):
    if n == 0:
        print('\n'.join(results))
        return

    x = int(lines[0])
    nums = list(map(int, lines[1].split()))

    if len(nums) != x:
        process(lines[2:], n - 1, results + ['-1'])
    else:
        filtered = list(filter(lambda y: y <= 0, nums))
        total = reduce(lambda acc, y: acc + y ** 4, filtered, 0)
        process(lines[2:], n - 1, results + [str(total)])


def main():
    n = int(input())
    lines = []
    collect(lines, n * 2)
    process(lines, n, [])


def collect(lines, remaining):
    if remaining == 0:
        return
    lines.append(input())
    collect(lines, remaining - 1)


if __name__ == "__main__":
    main()